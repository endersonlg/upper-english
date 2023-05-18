import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { sessionOptions } from '@/src/lib/session'
import { withIronSessionApiRoute } from 'iron-session/next'

interface ResponseListClassrooms {
  result: {
    after?: any[]
    before?: any[]
    data: {
      ref: {
        id: string
      }
      data: {
        students: {
          id: string
          name: string
          present: boolean
        }[]
        teacher: string
        unit: number
        page: number
        lastWord: string
        lastDictation?: string
        lastReading?: string
        dateShow: string
        dateTime: string
        group: {
          id: string
          name: string
        }
      }
    }[]
  }
  total: number
}

export async function listClassroomsByStudent(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { after, before, student } = req.query

  const afterSplit = after && (after as string).split(',')
  const beforeSplit = before && (before as string).split(',')

  try {
    const { result, total } = await fauna.query<ResponseListClassrooms>(
      q.Let(
        {
          result: q.Map(
            q.Filter(
              q.Paginate(q.Match(q.Index('all_classrooms_by_ts')), {
                size: 8,
                after: afterSplit && [
                  Number(afterSplit[0]),
                  q.Ref(q.Collection('classrooms'), afterSplit[1]),
                ],
                before: beforeSplit && [
                  beforeSplit[0],
                  q.Ref(q.Collection('classrooms'), beforeSplit[1]),
                ],
              }),
              q.Lambda(
                ['ts', 'ref'],
                q.Reduce(
                  q.Lambda(
                    ['acc', 'value'],
                    q.If(
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(q.Select('name', q.Var('value'))),
                        ),
                        q.LowerCase(student as string),
                      ),
                      true,
                      q.Var('acc'),
                    ),
                  ),
                  false,
                  q.Select(['data', 'students'], q.Get(q.Var('ref'))),
                ),
              ),
            ),

            q.Lambda(['ts', 'ref'], q.Get(q.Var('ref'))),
          ),
          total: q.Count(
            q.Filter(
              q.Documents(q.Collection('classrooms')),
              q.Lambda((ref) =>
                q.Reduce(
                  q.Lambda(
                    ['acc', 'value'],
                    q.If(
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(q.Select('name', q.Var('value'))),
                        ),
                        q.LowerCase(student as string),
                      ),
                      true,
                      q.Var('acc'),
                    ),
                  ),
                  false,
                  q.Select(['data', 'students'], q.Get(ref)),
                ),
              ),
            ),
          ),
        },
        {
          result: q.Var('result'),
          total: q.Var('total'),
        },
      ),
    )

    return res.status(200).json({
      classrooms: result.data.map((classroom) => ({
        id: classroom.ref.id,
        teacher: classroom.data.teacher,
        student,
        unit: classroom.data.unit,
        page: classroom.data.page,
        lastWord: classroom.data.lastWord,
        dateTime: classroom.data.dateTime,
        dateShow: classroom.data.dateShow,
        lastDictation: classroom.data.lastDictation ?? null,
        lastReading: classroom.data.lastReading ?? null,
        group: classroom.data.group,
        present: classroom.data.students.find(
          (students) => students.name === student,
        )?.present,
      })),
      after: result.after && [String(result.after[0]), result.after[1].id],
      before: result.before && [String(result.before[0]), result.before[1].id],
      total,
    })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

export default withIronSessionApiRoute(listClassroomsByStudent, sessionOptions)

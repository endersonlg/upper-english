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
        }
        teacher: string
        unit: number
        group: number
        lastWord: string
        lastDictation?: string
        lastReading?: string
      }
    }[]
  }
  total: number
}

export async function listClassrooms(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { after, before, search } = req.query

  const afterSplit = after && (after as string).split(',')
  const beforeSplit = before && (before as string).split(',')

  console.log(afterSplit)

  try {
    const { result, total } = await fauna.query<ResponseListClassrooms>(
      q.Let(
        {
          result: q.Map(
            search
              ? q.Filter(
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
                    q.Or(
                      q.ContainsStr(
                        q.LowerCase(
                          q.Select(['data', 'lastWord'], q.Get(q.Var('ref'))),
                        ),
                        q.LowerCase(search),
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.Select(
                            ['data', 'teacher', 'name'],
                            q.Get(q.Var('ref')),
                          ),
                        ),
                        q.LowerCase(search),
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(
                            q.Select(['data', 'page'], q.Get(q.Var('ref'))),
                          ),
                        ),
                        q.LowerCase(search),
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(
                            q.Select(['data', 'unit'], q.Get(q.Var('ref'))),
                          ),
                        ),
                        q.LowerCase(search),
                      ),
                      q.If(
                        q.IsString(
                          q.Select(
                            ['data', 'lastReading'],
                            q.Get(q.Var('ref')),
                            null,
                          ),
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(
                              ['data', 'lastReading'],
                              q.Get(q.Var('ref')),
                            ),
                          ),
                          q.LowerCase(search),
                        ),
                        false,
                      ),
                      q.If(
                        q.IsString(
                          q.Select(
                            ['data', 'lastDictation'],
                            q.Get(q.Var('ref')),
                            null,
                          ),
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(
                              ['data', 'lastDictation'],
                              q.Get(q.Var('ref')),
                            ),
                          ),
                          q.LowerCase(search),
                        ),
                        false,
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(
                            q.Select(['data', 'dateShow'], q.Get(q.Var('ref'))),
                          ),
                        ),
                        q.LowerCase(search),
                      ),
                      q.If(
                        q.IsString(
                          q.Select(
                            ['data', 'group', 'name'],
                            q.Get(q.Var('ref')),
                            null,
                          ),
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(
                              ['data', 'group', 'name'],
                              q.Get(q.Var('ref')),
                            ),
                          ),
                          q.LowerCase(search),
                        ),
                        false,
                      ),
                      q.Reduce(
                        q.Lambda(
                          ['acc', 'value'],
                          q.If(
                            q.ContainsStr(
                              q.LowerCase(
                                q.ToString(q.Select('name', q.Var('value'))),
                              ),
                              q.LowerCase(search),
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
                )
              : q.Paginate(q.Match(q.Index('all_classrooms_by_ts')), {
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
            q.Lambda(['ts', 'ref'], q.Get(q.Var('ref'))),
          ),
          total: q.Count(
            search
              ? q.Filter(
                  q.Documents(q.Collection('classrooms')),
                  q.Lambda((ref) =>
                    q.Or(
                      q.ContainsStr(
                        q.LowerCase(q.Select(['data', 'lastWord'], q.Get(ref))),
                        q.LowerCase(search),
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.Select(['data', 'teacher', 'name'], q.Get(ref)),
                        ),
                        q.LowerCase(search),
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(q.Select(['data', 'page'], q.Get(ref))),
                        ),
                        q.LowerCase(search),
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(q.Select(['data', 'unit'], q.Get(ref))),
                        ),
                        q.LowerCase(search),
                      ),
                      q.If(
                        q.IsString(
                          q.Select(['data', 'lastReading'], q.Get(ref), null),
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(['data', 'lastReading'], q.Get(ref)),
                          ),
                          q.LowerCase(search),
                        ),
                        false,
                      ),
                      q.If(
                        q.IsString(
                          q.Select(['data', 'lastDictation'], q.Get(ref), null),
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(['data', 'lastDictation'], q.Get(ref)),
                          ),
                          q.LowerCase(search),
                        ),
                        false,
                      ),
                      q.ContainsStr(
                        q.LowerCase(
                          q.ToString(
                            q.Select(['data', 'dateShow'], q.Get(ref)),
                          ),
                        ),
                        q.LowerCase(search),
                      ),
                      q.If(
                        q.IsString(
                          q.Select(['data', 'group', 'name'], q.Get(ref), null),
                        ),
                        q.ContainsStr(
                          q.LowerCase(
                            q.Select(['data', 'group', 'name'], q.Get(ref)),
                          ),
                          q.LowerCase(search),
                        ),
                        false,
                      ),
                      q.Reduce(
                        q.Lambda(
                          ['acc', 'value'],
                          q.If(
                            q.ContainsStr(
                              q.LowerCase(
                                q.ToString(q.Select('name', q.Var('value'))),
                              ),
                              q.LowerCase(search),
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
                )
              : q.Documents(q.Collection('classrooms')),
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
        ...classroom.data,
      })),
      after: result.after && [String(result.after[0]), result.after[1].id],
      before: result.before && [String(result.before[0]), result.before[1].id],
      total,
    })
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

export default withIronSessionApiRoute(listClassrooms, sessionOptions)

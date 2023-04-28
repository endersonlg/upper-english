import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { sessionOptions } from '@/src/lib/session'
import { withIronSessionApiRoute } from 'iron-session/next'

interface ResponseListClassrooms {
  result: {
    after?: [
      ref: {
        id: string
      },
    ]
    before?: [
      ref: {
        id: string
      },
    ]
    data: {
      ref: {
        id: string
      }
      data: {
        student: string
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
  const { after, before } = req.query

  try {
    const { result, total } = await fauna.query<ResponseListClassrooms>(
      q.Let(
        {
          result: q.Map(
            q.Paginate(q.Documents(q.Collection('classrooms')), {
              size: 8,
              after: after && q.Ref(q.Collection('classrooms'), after),
              before: before && q.Ref(q.Collection('classrooms'), before),
            }),
            q.Lambda((classroom) => q.Get(classroom)),
          ),
          total: q.Count(q.Documents(q.Collection('classrooms'))),
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
      after: result.after?.[0].id,
      before: result.before?.[0].id,
      total,
    })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

export default withIronSessionApiRoute(listClassrooms, sessionOptions)

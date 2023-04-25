/* eslint-disable camelcase */
import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseEditGroup {
  ref: {
    id: string
  }

  data: {
    name: string
  }
}

export default async function editGroup(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, name, removeStudentsId, newStudentsId } = req.body

  try {
    const { data, ref } = await fauna.query<ResponseEditGroup>(
      q.Update(q.Ref(q.Collection('groups'), id), {
        data: {
          name: q.Trim(q.UpperCase(name)),
        },
      }),
    )

    for (let i = 0; i < removeStudentsId.length; i++) {
      const userId = removeStudentsId[i]
      await fauna.query(
        q.Update(q.Ref(q.Collection('students'), userId), {
          data: {
            group_id: null,
          },
        }),
      )
    }

    for (let i = 0; i < newStudentsId.length; i++) {
      const userId = newStudentsId[i]
      await fauna.query(
        q.Update(q.Ref(q.Collection('students'), userId), {
          data: {
            group_id: ref.id,
          },
        }),
      )
    }

    return res.status(201).json({
      group: {
        id: ref.id,
        name: data.name,
      },
    })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

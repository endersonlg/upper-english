/* eslint-disable camelcase */
import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseRegisterGroup {
  ref: {
    id: string
  }

  data: {
    name: string
  }
}

export default async function registerGroup(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name, user_ids } = req.body

  try {
    const exists = await fauna.query(
      q.Exists(q.Match(q.Index('group_by_name'), q.Trim(q.UpperCase(name)))),
    )

    if (exists) {
      return res.status(400).json({ error: 'Group already registered!' })
    }

    const { data, ref } = await fauna.query<ResponseRegisterGroup>(
      q.Create(q.Collection('groups'), {
        data: {
          name: q.Trim(q.UpperCase(name)),
        },
      }),
    )

    for (let i = 0; i < user_ids.length; i++) {
      const userId = user_ids[i]
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

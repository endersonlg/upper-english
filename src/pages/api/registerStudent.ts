import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseRegisterStudent {
  ref: {
    id: string
  }

  data: {
    name: string
  }
}

export default async function registerStudent(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name } = req.body

  try {
    const exists = await fauna.query(
      q.Exists(q.Match(q.Index('student_by_name'), q.Trim(q.UpperCase(name)))),
    )

    if (exists) {
      return res.status(400).json({ error: 'User already registered!' })
    }

    const { data, ref } = await fauna.query<ResponseRegisterStudent>(
      q.Create(q.Collection('students'), {
        data: {
          name: q.Trim(q.UpperCase(name)),
        },
      }),
    )

    return res.status(201).json({
      student: {
        id: ref.id,
        name: data.name,
      },
    })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

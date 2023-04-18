/* eslint-disable camelcase */
import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseRegisterNewClassroom {
  ref: {
    id: string
  }

  data: {
    student: string
    teacher: string
    unit: string
    group: string
    lastWord: string
    lastDictation: string | null
    lastReading: string | null
  }
}

export default async function registerClassroom(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    student,
    teacher,
    unit,
    group,
    lastWord,
    lastDictation,
    lastReading,
  } = req.body

  try {
    const { data, ref } = await fauna.query<ResponseRegisterNewClassroom>(
      q.Create(q.Collection('classrooms'), {
        data: {
          student,
          teacher,
          unit,
          group,
          lastWord,
          lastDictation,
          lastReading,
        },
      }),
    )

    return res.status(201).json({
      classroom: {
        id: ref.id,
        ...data,
      },
    })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

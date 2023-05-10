/* eslint-disable camelcase */
import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseRegisterNewClassroom {
  ref: {
    id: string
  }
}

export default async function registerClassroom(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const {
    teacher,
    students,
    unit,
    page,
    lastWord,
    lastDictation,
    lastReading,
    dateTime,
    dateShow,
    group,
  } = req.body

  try {
    await fauna.query<ResponseRegisterNewClassroom>(
      q.Create(q.Collection('classrooms'), {
        data: {
          teacher,
          students,
          unit,
          page,
          lastWord,
          lastDictation,
          lastReading,
          dateTime,
          dateShow,
          group,
        },
      }),
    )

    return res.status(201).json({ message: 'Success' })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

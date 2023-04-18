import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseListTeachersAndStudents {
  teachers: {
    data: {
      ref: {
        id: string
      }
      data: {
        name: string
      }
    }[]
  }
  students: {
    data: {
      ref: {
        id: string
      }
      data: {
        name: string
        email: string
      }
    }[]
  }
}

const limit = 100000

export default async function listTeachersAndStudents(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = await fauna.query<ResponseListTeachersAndStudents>(
      q.Let(
        {
          teachers: q.Map(
            q.Paginate(q.Documents(q.Collection('teachers')), {
              size: limit,
            }),
            q.Lambda((student) => q.Get(student)),
          ),
          students: q.Map(
            q.Paginate(q.Documents(q.Collection('students')), {
              size: limit,
            }),
            q.Lambda((student) => q.Get(student)),
          ),
        },
        {
          students: q.Var('students'),
          teachers: q.Var('teachers'),
        },
      ),
    )

    const teachers = data.teachers.data.map((teacher) => ({
      id: teacher.ref.id,
      name: teacher.data.name,
    }))

    const students = data.students.data.map((student) => ({
      id: student.ref.id,
      ...student.data,
    }))

    return res.status(200).json({ teachers, students })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

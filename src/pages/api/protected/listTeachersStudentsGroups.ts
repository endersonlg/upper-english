import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

interface ResponseListTeachersStudentsGroups {
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
  groups: {
    data: {
      group: {
        ref: {
          id: string
        }
        data: {
          name: string
        }
      }
      students: {
        data: {
          ref: {
            id: string
          }
          data: {
            name: string
          }
        }[]
      }
    }[]
  }
}

const limit = 100000

export default async function listTeachersStudentsGroups(
  _: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const data = await fauna.query<ResponseListTeachersStudentsGroups>(
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
          groups: q.Map(
            q.Paginate(q.Documents(q.Collection('groups')), { size: limit }),
            q.Lambda((group) =>
              q.Merge(
                { group: q.Get(group) },
                {
                  students: q.Map(
                    q.Paginate(
                      q.Match(
                        q.Index('student_by_group_id'),
                        q.Select(['ref', 'id'], q.Get(group)),
                      ),
                    ),
                    q.Lambda((student) => q.Get(student)),
                  ),
                },
              ),
            ),
          ),
        },
        {
          students: q.Var('students'),
          teachers: q.Var('teachers'),
          groups: q.Var('groups'),
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

    const groups = data.groups.data.map((group) => ({
      id: group.group.ref.id,
      name: group.group.data.name,
      students: group.students.data.map((student) => ({
        id: student.ref.id,
        name: student.data.name,
      })),
    }))

    return res.status(200).json({ teachers, students, groups })
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }
}

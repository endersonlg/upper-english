import { fauna } from '@/src/services/fauna'
import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'

export default async function deleteGroup(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  try {
    await fauna.query(q.Delete(q.Ref(q.Collection('groups'), id)))
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Server unavailable, please try again later' })
  }

  return res.status(202).json({ message: 'deleted' })
}

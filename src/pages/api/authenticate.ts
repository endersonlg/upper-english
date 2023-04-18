/* eslint-disable camelcase */
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'
import { sessionOptions } from '@/src/lib/session'
import { fauna } from '@/src/services/fauna'
import { query as q } from 'faunadb'

export type Auth = {
  isAuthenticated: boolean
}

async function authenticate(req: NextApiRequest, res: NextApiResponse) {
  const { password } = req.body

  try {
    const exists = await fauna.query(
      q.Exists(q.Match(q.Index('secret_password'), password)),
    )

    if (!exists) {
      res.status(400).json({ error: 'Invalid password' })
    }

    const auth = { isAuthenticated: true }

    req.session.auth = auth

    await req.session.save()

    res.json(auth)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
}

export default withIronSessionApiRoute(authenticate, sessionOptions)

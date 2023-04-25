import { sessionOptions } from '@/src/lib/session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function getAuthentication(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.auth) {
    res.json({
      isAuthenticated: true,
    })
  } else {
    res.json({
      isAuthenticated: false,
    })
  }
}

export default withIronSessionApiRoute(getAuthentication, sessionOptions)

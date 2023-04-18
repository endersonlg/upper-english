import { sessionOptions } from '@/src/lib/session'
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function getAuthentication(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.auth) {
    res.json({
      isLoggedIn: true,
    })
  } else {
    res.json({
      isLoggedIn: false,
    })
  }
}

export default withIronSessionApiRoute(getAuthentication, sessionOptions)

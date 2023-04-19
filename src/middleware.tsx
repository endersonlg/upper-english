import { NextRequest, NextResponse } from 'next/server'

import { sessionOptions } from '@/src/lib/session'
import { getIronSession } from 'iron-session/edge'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const { auth } = await getIronSession(req, res, sessionOptions)

  if (!auth?.isAuthenticated) {
    return NextResponse.json({ error: 'Not authenticated' })
  }

  return res
}

export const config = {
  matcher: ['/(api/protected.*)'],
}

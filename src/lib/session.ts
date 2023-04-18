// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from 'iron-session'
import { Auth } from '../pages/api/authenticate'

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'upper-english-session',
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}

// This is where we specify the typings of req.session.*
declare module 'iron-session' {
  // eslint-disable-next-line no-unused-vars
  interface IronSessionData {
    auth?: Auth
  }
}

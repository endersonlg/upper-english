import { Input } from '@/src/components/Input'
import { AuthContext } from '@/src/context/AuthContext'
import { sessionOptions } from '@/src/lib/session'
import { withIronSessionSsr } from 'iron-session/next'
import { CircleNotch } from 'phosphor-react'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const loginFormSchema = z.object({
  password: z.string().min(8),
})

type LoginFormSchemaInputs = z.infer<typeof loginFormSchema>

export default function Login(props: any) {
  const { login } = useContext(AuthContext)

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm<LoginFormSchemaInputs>()

  async function handleLogin({ password }: LoginFormSchemaInputs) {
    await login({ password })
  }

  return (
    <main
      className="flex items-center justify-center h-full"
      onSubmit={handleSubmit(handleLogin)}
    >
      <form autoComplete="off">
        <Input
          label="Password"
          placeholder="Type the Password"
          required
          minLength={6}
          type="password"
          {...register('password')}
        />

        <button
          type="submit"
          className="flex items-center justify-center w-full gap-2 mt-6 bg-green-500 p-4 rounded-lg  hover:enabled:bg-green-700 transition duration-200 ease-in-out"
          disabled={isSubmitting}
        >
          {isSubmitting && <CircleNotch size={24} className="animate-spin" />}
          Login
        </button>
      </form>
    </main>
  )
}

export const getServerSideProps = withIronSessionSsr(async function ({ req }) {
  const auth = req.session.auth

  if (auth?.isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        statusCode: 302,
      },
    }
  }

  return {
    props: {},
  }
}, sessionOptions)

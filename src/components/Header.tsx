import Link from 'next/link'
import { ClipboardText, Student, UsersThree } from 'phosphor-react'
import Image from 'next/image'

import logo from '../assets/logo.svg'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export function Header() {
  const { isAuthenticated } = useContext(AuthContext)
  const router = useRouter()

  return (
    <header className="flex items-center justify-between ">
      <Link href={'/'}>
        <Image src={logo} alt="" width={120} height={120} />
      </Link>
      {isAuthenticated && (
        <nav className="flex gap-2 ">
          <Link
            href="/"
            className={'w-12 h-12 flex justify-center items-center text-gray-100 border-y-2 border-solid border-transparent transition duration-200 ease-in-out hover:border-b-green-500'.concat(
              router.pathname === '/' ? ' text-green-500' : '',
            )}
          >
            <ClipboardText size={24} />
          </Link>

          <Link
            href="/groups"
            className={'w-12 h-12 flex justify-center items-center text-gray-100 border-y-2 border-solid border-transparent transition duration-200 ease-in-out hover:border-b-green-500'.concat(
              router.pathname === '/groups' ? ' text-green-500' : '',
            )}
          >
            <UsersThree size={24} />
          </Link>

          <Link
            href="/students"
            className={'w-12 h-12 flex justify-center items-center text-gray-100 border-y-2 border-solid border-transparent transition duration-200 ease-in-out hover:border-b-green-500'.concat(
              router.pathname === '/students' ? ' text-green-500' : '',
            )}
          >
            <Student size={24} />
          </Link>
        </nav>
      )}
    </header>
  )
}

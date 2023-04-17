import Link from 'next/link'
import { ClipboardText, Student } from 'phosphor-react'
import Image from 'next/image'

import logo from '../assets/logo.svg'
import { useRouter } from 'next/router'

export function Header() {
  const router = useRouter()

  return (
    <header className="flex items-center justify-between ">
      <Image src={logo} alt="" width={120} height={120} />
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
          href="/students"
          className={'w-12 h-12 flex justify-center items-center text-gray-100 border-y-2 border-solid border-transparent transition duration-200 ease-in-out hover:border-b-green-500'.concat(
            router.pathname === '/students' ? ' text-green-500' : '',
          )}
        >
          <Student size={24} />
        </Link>
      </nav>
    </header>
  )
}

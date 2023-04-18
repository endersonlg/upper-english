import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultLayout } from '../layouts/DefaultLayout'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../lib/queryClient'
import { UsersProvider } from '../context/UsersContext'

import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'
import { AuthProvider } from '../context/AuthContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DefaultLayout>
          <UsersProvider>
            <Component {...pageProps} />
          </UsersProvider>
        </DefaultLayout>
      </AuthProvider>
      <ToastContainer position="bottom-right" theme="dark" />
    </QueryClientProvider>
  )
}

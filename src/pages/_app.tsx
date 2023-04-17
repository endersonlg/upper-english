import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { DefaultLayout } from '../layouts/DefaultLayout'
import { QueryClientProvider } from 'react-query'
import { queryClient } from '../lib/queryClient'
import { UsersProvider } from '../context/UsersContext'

import 'react-toastify/dist/ReactToastify.css'

import { ToastContainer } from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DefaultLayout>
      <QueryClientProvider client={queryClient}>
        <UsersProvider>
          <Component {...pageProps} />
        </UsersProvider>
      </QueryClientProvider>
      <ToastContainer position="bottom-right" theme="dark" />
    </DefaultLayout>
  )
}

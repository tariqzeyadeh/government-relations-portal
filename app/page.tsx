'use client'

import { AppProvider, useApp } from '@/lib/app-context'
import { LoginScreen } from '@/components/login-screen'
import { MainLayout } from '@/components/main-layout'

function AppRouter() {
  const { isLoggedIn } = useApp()
  return isLoggedIn ? <MainLayout /> : <LoginScreen />
}

export default function Home() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  )
}

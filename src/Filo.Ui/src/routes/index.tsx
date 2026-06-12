import { type RouteObject } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { AuthGuard } from '@/components/AuthGuard'
import { Home } from '@/pages/Home'
import { Login } from '@/pages/Login'
import { Dashboard } from '@/pages/Dashboard'
import { NotFound } from '@/pages/NotFound'
import { SystemInfo } from '@/pages/SystemInfo'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/system-info',
    element: <SystemInfo />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        path: '/dashboard',
        element: <Dashboard />,
      },
    ],
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

import { type RouteObject } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { Home } from '@/pages/Home'
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
    element: <RootLayout />,
    children: [
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]

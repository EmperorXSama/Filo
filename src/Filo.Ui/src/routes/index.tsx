/* eslint-disable react-refresh/only-export-components -- route config, not a component */

import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { RootLayout } from '@/layouts/RootLayout'
import { Home } from '@/pages/Home'

const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Dashboard = lazy(() => import('@/pages/Dashboard').then((m) => ({ default: m.Dashboard })))
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const SystemInfo = lazy(() => import('@/pages/SystemInfo').then((m) => ({ default: m.SystemInfo })))
const KnowMore = lazy(() => import('@/pages/KnowMore').then((m) => ({ default: m.KnowMore })))

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
    path: '/know-more',
    element: <KnowMore />,
  },
  {
    path: '/auth/login',
    element: <Login />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
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

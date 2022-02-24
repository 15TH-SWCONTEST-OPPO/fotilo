import React, {lazy, Suspense} from 'react';
import {RouteObject, useRoutes,Navigate} from 'react-router-native';

import StartP from './pages/StartP';
import Loading from './pages/Loading';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Forget = lazy(() => import('./pages/Forget'));
const Home = lazy(() => import('./pages/Home'));

const routes: RouteObject[] = [
  {
    path: '/StartP',
    element: <StartP />,
  },
  {
    path: '/login',
    element: <Login />,
    children: [
      {
        path: 'foget',
        element: <Forget />,
      },
    ],
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/',
    element: <Navigate to="startP"/>,
  },
];

export default function Router() {
  const element = useRoutes(routes);
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
}

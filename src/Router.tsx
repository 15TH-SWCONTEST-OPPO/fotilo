import React, {lazy, Suspense} from 'react';
import {RouteObject, useRoutes, Navigate} from 'react-router-native';

import StartP from './pages/StartP';
import Loading from './pages/Loading';
import Login from './pages/StartP/Login';
import StartP_Home from './pages/StartP/Home';
import Register from './pages/StartP/Register';
import Code from './pages/StartP/Code';
import Home from './pages/Home';

const routes: RouteObject[] = [
  {
    path: '/StartP',
    element: <StartP />,
    children: [
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'code',
        element: <Code />,
      },
      {
        path: '',
        element: <StartP_Home />,
      },
    ],
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/',
    element: <Navigate to="startP" />,
  },
];

export default function Router() {
  const element = useRoutes(routes);
  return <Suspense fallback={<Loading />}>{element}</Suspense>;
}

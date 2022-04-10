import React, {lazy, Suspense} from 'react';
import {RouteObject, useRoutes, Navigate} from 'react-router-native';

import StartP from './pages/StartP';
import Loading from './pages/Loading';
import Login from './components/Login';
import StartP_Home from './pages/StartP/Home';
import Register from './pages/StartP/Register';
import Code from './pages/StartP/Code';
import Home from './pages/Home';
import Home_Home from './pages/Home/Home';
import Dynamic from './pages/Home/Dynamic';
import Video from './pages/Home/Video';
import Action from './pages/Home/Action';
import Me from './pages/Home/Me';

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
    children: [
      {
        path: 'dynamic',
        element: <Dynamic />,
      },
      {
        path: 'video',
        element: <Video />,
      },
      {
        path: 'action',
        element: <Action />,
      },
      {
        path: 'me',
        element: <Me />,
      },
      {
        path: '',
        element: <Home_Home />,
      },
    ],
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

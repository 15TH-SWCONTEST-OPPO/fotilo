import React, {lazy, Suspense} from 'react';
import {RouteObject, useRoutes, Navigate} from 'react-router-native';

import StartP from './pages/StartP';
import Loading from './pages/Loading';
import Login from './pages/StartP/Login';
import StartP_Home from './pages/StartP/Home';
import Register from './pages/StartP/Register';
import Code from './pages/StartP/Code';
import Home from './pages/Home';
import Home_Home from './pages/Home/Home';
import Dynamic from './pages/Home/Dynamic';
import Video from './pages/Home/Video';
import Action from './pages/Home/Action';
import User from './pages/Home/User';
import VideoShow from './pages/VideoShow';
import VideoLike from './pages/VideoShow/VideoLike'
import Comment from './pages/VideoShow/Comment'

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
        path: 'user',
        element: <User />,
      },
      
      {
        path: '',
        element: <Home_Home />,
      },
    ],
  },
  {
    path: '/video',
    element: <VideoShow />,
    children: [
      {
        path: 'comment',
        element:<Comment/>
      },
      {
        path: '',
        element:<VideoLike/>
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

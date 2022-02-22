import React from 'react';
import {RouteObject, useRoutes} from 'react-router-native';

const routes: RouteObject[] = [
    
];

export default function Router() {
  const element = useRoutes(routes);
  return <>{element}</>;
}

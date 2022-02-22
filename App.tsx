import React from 'react';
import {NativeBaseProvider} from 'native-base';
import {NativeRouter} from 'react-router-native';
import Routers from './src/Router';

const App = () => {


  return (
    <NativeBaseProvider>
      <NativeRouter>
        <Routers/>
      </NativeRouter>
    </NativeBaseProvider>
  );
};

export default App;

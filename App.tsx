import React, {useEffect} from 'react';
import {NativeBaseProvider, StatusBar} from 'native-base';
import {NativeRouter} from 'react-router-native';
import Routers from './src/Router';
import changeNavigationBarColor, {
  hideNavigationBar,
} from 'react-native-navigation-bar-color';
import {AppState} from 'react-native';

const App = () => {

  useEffect(() => {
    hideNavigationBar();
    AppState.addEventListener('focus', () => {
      hideNavigationBar();
    });
  }, []);


  return (
    <NativeBaseProvider> 
      <NativeRouter>
        <Routers />
      </NativeRouter>
    </NativeBaseProvider>
  );
};

export default App;

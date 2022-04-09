import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NativeRouter} from 'react-router-native';
import Routers from './src/Router';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import {AppState, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store'
import Orientation from 'react-native-orientation-locker';

const App = () => {

  useEffect(() => {
    hideNavigationBar();
    AppState.addEventListener('focus', () => {
      hideNavigationBar();
    });
    StatusBar.setBackgroundColor('transparent');
    Orientation.lockToPortrait();
    
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NativeRouter>
          <Routers />
        </NativeRouter>
      </NativeBaseProvider>
    </Provider>
  );
};



export default App;

import React, {useEffect} from 'react';
import {NativeBaseProvider} from 'native-base';
import {NativeRouter, useLocation} from 'react-router-native';
import Routers from './src/Router';
import {hideNavigationBar} from 'react-native-navigation-bar-color';
import {AppState, ImageBackground, StyleSheet} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/store'

const App = () => {

  useEffect(() => {
    hideNavigationBar();
    AppState.addEventListener('focus', () => {
      hideNavigationBar();
    });
  }, []);

  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NativeRouter>
          <Routers />
          <ImageBackground
            style={styles.background}
            source={require('./src/static/img/background.gif')}
          />
        </NativeRouter>
      </NativeBaseProvider>
    </Provider>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -999,
  },
});

export default App;

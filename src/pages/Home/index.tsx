import {View, Text, StyleSheet, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import StatusBarSpace from '../../components/StatusBarSpace';
import TopBar from '../../components/TopBar';
import BottomBar from '../../components/BottomBar';
import {Outlet, useLocation} from 'react-router-native';
import getLoc from '../../utils/getLoc';

export default function Home() {
  /* 
    上边栏切入
  */
  const cutAnim = useRef(new Animated.Value(0)).current;

  const cutIn = () => {
    Animated.timing(cutAnim, {
      toValue: 50,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const cutOut = () => {
    Animated.timing(cutAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  let location = useLocation();
  useEffect(() => {
    const loc = getLoc(location, 2);
    loc !== 'me' && loc !== 'video' ? cutIn() : cutOut();
  }, [location.pathname]);

  return (
    <View style={styles.container}>
      <StatusBarSpace />
      <Animated.View style={[{overflow: 'hidden'}, {height: cutAnim}]}>
        <TopBar />
      </Animated.View>
      <View style={{...styles.center}}>
        <Outlet />
      </View>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  center: {
    flexGrow: 1,
    flexShrink:1,
    // backgroundColor: 'blue'
    overflow: 'hidden',
  },
});

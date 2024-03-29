import {
  View,
  StyleSheet,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import StatusBarSpace from '../../components/StatusBarSpace';
import TopBar from '../../components/TopBar';
import BottomBar from '../../components/BottomBar';
import {Outlet, useLocation} from 'react-router-native';
import getLoc from '../../utils/getLoc';
import ImageChoose from '../../components/ImageChoose';
import {useAppSelector} from '../../store/hooks';
import Upload from '../../components/Upload';
import ShowImg from '../../components/ShowImg';
import VideoPlayer from '../../components/VideoPlayer';

const wait = (timeout:number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function Home() {
  const {show} = useAppSelector(s => s.imgChoose);

  /* 
    上边栏切入
  */
  const cutAnim = useRef(new Animated.Value(0)).current;

  const cutIn = () => {
    Animated.timing(cutAnim, {
      toValue: 60,
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

  const {show: imgC} = useAppSelector(store => store.imgC);

  let location = useLocation();
  useEffect(() => {
    const loc = getLoc(location, 2);
    loc !== 'user' && loc !== 'video' ? cutIn() : cutOut();
  }, [location.pathname]);

  return (
    <View style={styles.container}>
      <StatusBarSpace />
      {imgC && <ImageChoose />}
      {show && <ShowImg />}
      <Animated.View style={[{overflow: 'hidden'}, {height: cutAnim}]}>
        <TopBar />
      </Animated.View>
      <View
        style={{...styles.center}}>
        <Outlet />
      </View>
      <BottomBar />
      <Upload />
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
    flexShrink: 1,
    // backgroundColor: 'blue',
    overflow: 'hidden',
  },
});

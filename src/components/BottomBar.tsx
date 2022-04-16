import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-native';
import Button from './Button';
import {
  Action,
  ActionActive,
  Dynamic,
  DynamicActive,
  Home,
  HomeActive,
  Me,
  MeActive,
  VideoLogo,
} from '../static/myIcon';
import {basicColor} from '../static/color';
import getLoc from '../utils/getLoc';
import { useAppSelector } from '../store/hooks';

export default function BottomBar() {
  const navigation = useNavigate();
  const location = useLocation();
  const [loca, setLoca] = useState('');
  const user=useAppSelector(s=>s.user)
  useEffect(() => {
    const loc: string = getLoc(location,2);
    setLoca(loc ? loc : '');
  },[location.pathname]);
  return (
    <View style={{...styles.container}}>
      <View style={{...styles.inner}}>
        <Button
          style={{...styles.btn}}
          onPress={() => {
            navigation('');
          }}>
          {loca === '' ? <HomeActive color={basicColor} /> : <Home />}
          <Text
            style={{...styles.btnT, color: loca === '' ? basicColor : 'white'}}>
            首页
          </Text>
        </Button>

        <Button
          style={{...styles.btn}}
          onPress={() => {
            navigation('dynamic');
          }}>
          {loca === 'dynamic' ? (
            <DynamicActive color={basicColor} />
          ) : (
            <Dynamic />
          )}
          <Text
            style={{
              ...styles.btnT,
              color: loca === 'dynamic' ? basicColor : 'white',
            }}>
            动态
          </Text>
        </Button>

        <Button
          style={{
            ...styles.btn,
            borderColor: basicColor,
            borderWidth: 2,
            borderRadius: 200,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            width: 68,
            height: 68,
          }}
          onPress={() => {
            navigation('video');
          }}>
          <View style={{...styles.shade}} />
          <View style={{flexDirection: 'row'}}>
            <View style={{width: 10, height: 2}} />
            <VideoLogo
              size={12}
              color={loca === 'video' ? basicColor : 'white'}
            />
          </View>
          <Text
            style={{
              ...styles.btnT,
              color: loca === 'video' ? basicColor : 'white',
            }}>
            随便看看
          </Text>
        </Button>

        <Button
          style={{...styles.btn}}
          onPress={() => {
            navigation('action');
          }}>
          {loca === 'action' ? <ActionActive color={basicColor} /> : <Action />}
          <Text
            style={{
              ...styles.btnT,
              color: loca === 'action' ? basicColor : 'white',
            }}>
            创作
          </Text>
        </Button>

        <Button
          style={{...styles.btn}}
          onPress={() => {
            navigation('user',{state:{...user}});
          }}>
          {loca === 'user' ? <MeActive color={basicColor} /> : <Me />}
          <Text
            style={{
              ...styles.btnT,
              color: loca === 'user' ? basicColor : 'white',
            }}>
            我的
          </Text>
        </Button>
      </View>
      <View style={{...styles.space}} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
  },
  space: {
    width: '100%',
    height: 15,
    backgroundColor: 'black',
  },
  inner: {
    // backgroundColor: 'white',
    borderTopColor: basicColor,
    borderTopWidth: 2,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  btn: {
    backgroundColor: 'transparent',
  },
  btnT: {},
  shade: {
    backgroundColor: 'black',
    height: 60,
    width: 100,
    position: 'absolute',
    top: 8,
  },
});

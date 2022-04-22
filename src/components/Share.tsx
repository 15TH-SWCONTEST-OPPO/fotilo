import {View, Text} from 'react-native';
import React, { useRef } from 'react';
import Input from './Input';
import Button from './Button';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {set} from '../store/features/shareSlice';
import {setDynamic} from '../api';

export default function Share() {
  const dispatch = useAppDispatch();
  const {videoId} = useAppSelector(s => s.share);
  const info=useRef("")

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 100,
        backgroundColor: 'black',
        borderTopWidth: 2,
        alignItems: 'center',
        zIndex: 999,
        justifyContent: 'space-between',
      }}>
      <View
        style={{
          width: 200,
          height: 5,
          backgroundColor: 'white',
          borderRadius: 5,
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
          width: '100%',
        }}>
        <Button
          style={{backgroundColor: 'transparent'}}
          onPress={() => {
            dispatch(set(false));
          }}>
          <Text style={{color: 'white', fontSize: 20}}>取消</Text>
        </Button>
        <Input
          placeholder="说点什么吧..."
          placeholderTextColor="white"
          iconSide="none"
          textStyle={{color: 'white',}}
          onChangeText={e => {
            info.current=e
          }}
          />
        <Button onPress={()=>{
          videoId &&
          setDynamic({content: info.current, videoId})
          .then(res => {
            console.log(res);
          })
          .catch(res => {
            console.log(res);
          });
          dispatch(set(false))
        }} style={{backgroundColor: 'transparent'}}>
          <Text style={{color: 'white', fontSize: 20}}>发布</Text>
        </Button>
      </View>
      <View />
    </View>
  );
}

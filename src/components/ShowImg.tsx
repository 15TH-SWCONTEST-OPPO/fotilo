import {View, Text, Image, Animated, PanResponder} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import Button from './Button';
import {setShow, setImgs, setIndex} from '../store/features/imgChooseSlice';
import {Loading} from '../static/myIcon';

export default function ShowImg() {
  const dispatch = useAppDispatch();
  const img = useAppSelector(s => s.imgChoose);
  const {index, show, pics} = img;
  const now = useRef(index);
  const last = useRef(index);
  const [load, setLoad] = useState(false);
  const [dx, setDx] = useState(0);

  useEffect(() => {
    now.current = index;
  }, [show]);

  useEffect(() => {
    console.log(pics);
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (a, b) => {
        if (Math.abs(b.dx) > 5 || Math.abs(b.dy) > 5) {
          return true;
        } else {
          return false;
        }
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, b) => {
        if (last.current === now.current) {
          if (b.dx > 2) {
            now.current = Math.max(now.current - 1, 0);
          } else if (b.dx < -2) {
            now.current = Math.min(now.current + 1, pics.length - 1);
          }
          setDx(b.dx);
        }
      },
      onPanResponderRelease: () => {
        last.current = now.current;
      },
    }),
  ).current;

  return (
    <>
      <View
        {...panResponder.panHandlers}
        style={[
          {
            width: '100%',
            backgroundColor: 'black',
            position: 'absolute',
            zIndex: 999,
          },
          {height: '100%'},
        ]}>
        {load && (
          <View style={{position: 'absolute', left: '43%', top: '48%'}}>
            <Loading size={20} />
          </View>
        )}
        <Button
          onPress={() => {
            dispatch(setShow(false));
          }}
          style={{
            width: '100%',
            height: '100%',
            padding: 0,
            backgroundColor: 'transparent',
          }}>
          {pics && (
            <Image
              source={{uri: pics[now.current]}}
              style={{width: '100%', height: '100%'}}
              resizeMode="contain"
              onLoadStart={() => {
                setLoad(true);
              }}
              onLoadEnd={() => {
                setLoad(false);
              }}
            />
          )}
          <View
            style={{
              position: 'absolute',
              bottom: 5,
              backgroundColor: '#00000050',
              padding: 2,
              borderRadius: 4,
            }}>
            <Text style={{color: 'white'}}>
              {now.current + 1}/{pics.length}
            </Text>
          </View>
        </Button>
      </View>
    </>
  );
}

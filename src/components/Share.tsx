import {View, Text, KeyboardAvoidingView, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Input from './Input';
import Button from './Button';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {set} from '../store/features/shareSlice';
import {setDynamic} from '../api';

export default function Share() {
  const dispatch = useAppDispatch();
  const {videoId, show} = useAppSelector(s => s.share);
  const info = useRef('');
  const cut = useRef(new Animated.Value(0)).current;

  const cutIn = () => {
    Animated.timing(cut, {
      toValue: 100,
      useNativeDriver: false,
      duration: 300,
    }).start();
  };

  const cutOut = () => {
    Animated.timing(cut, {
      toValue: 0,
      useNativeDriver: false,
      duration: 300,
    }).start();
  };

  useEffect(() => {
    show ? cutIn() : cutOut();
  }, [show]);

  return (
    <KeyboardAvoidingView
      style={{position: 'absolute', bottom: 0, zIndex: 999, width: '100%'}}
      behavior="padding">
      <Animated.View
        style={[
          {
            width: '100%',
            backgroundColor: 'black',
            borderTopWidth: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
          },
          {height: cut},
        ]}>
        <View
          style={{
            width: 200,
            height: 5,
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
            textStyle={{color: 'white'}}
            onChangeText={e => {
              info.current = e;
            }}
          />
          <Button
            onPress={() => {
              videoId &&
                setDynamic({content: info.current, videoId})
                  .then(res => {
                    console.log(res);
                  })
                  .catch(res => {
                    console.log(res);
                  });
              dispatch(set(false));
            }}
            style={{backgroundColor: 'transparent'}}>
            <Text style={{color: 'white', fontSize: 20}}>发布</Text>
          </Button>
        </View>
        <View />
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

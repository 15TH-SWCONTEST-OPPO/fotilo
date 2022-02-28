import {
  PressableProps,
  Pressable,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import React, {useRef} from 'react';

import {basicColor} from '../static/color';

const defaultRadius = 5;

interface BtnProps extends PressableProps {
  clickColor?: string;
}

export default function Button(props: BtnProps) {
  const shadow = useRef(new Animated.Value(0)).current;

  const {style: userStyle, onPress, children} = props;

  // 获取用户自定义style
  const uStyle: {[key: string]: any} =
    userStyle?.valueOf().constructor === Object
      ? {...(userStyle?.valueOf() as Object)}
      : {};

  return (
    <Pressable
      {...props}
      style={{...style.container, ...uStyle}}
      onPress={e => {
        Animated.timing(shadow, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: false,
        }).start();
        onPress && onPress(e);
      }}>
      <View
        style={{
          backgroundColor: 'black',
          width: '100%',
          zIndex:999,
          borderRadius: uStyle?.borderRadius || defaultRadius,
        }}
      />
      {children}
    </Pressable>
  );
}

const style = StyleSheet.create({
  container: {
    borderRadius: defaultRadius,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: basicColor,
  },
});

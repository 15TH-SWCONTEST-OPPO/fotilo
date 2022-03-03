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
const timeout = 1;

interface BtnProps extends PressableProps {
  clickColor?: string;
  textColor?: string;
}

export default function Button(props: BtnProps) {
  const shadow = useRef(new Animated.Value(0)).current;

  /* 
    动画
  */
  //  手指移入
  const moveIn = () => {
    Animated.timing(shadow, {
      toValue: 0.3,
      duration: timeout,
      useNativeDriver: false,
    }).start();
  };

  //  手指移出
  const moveOut = () => {
    Animated.timing(shadow, {
      toValue: 0,
      duration: timeout,
      useNativeDriver: false,
    }).start();
  };

  const {style: userStyle, onPressIn, onPressOut, children} = props;

  // 获取用户自定义style
  const uStyle: {[key: string]: any} =
    userStyle?.valueOf().constructor === Object
      ? {...(userStyle?.valueOf() as Object)}
      : {};

  return (
    <Pressable
      {...props}
      style={{...ownstyles.container, ...uStyle}}
      onPressIn={e => {
        moveIn();
        onPressIn && onPressIn(e);
      }}
      onPressOut={e => {
        moveOut();
        onPressOut && onPressOut(e);
      }}>
        {children}
      <Animated.View
        style={[
          {
            ...ownstyles.back,
            borderRadius: uStyle?.borderRadius || defaultRadius,
          },
          {opacity: shadow},
        ]}>
        <View />
      </Animated.View>
    </Pressable>
  );
}

const ownstyles = StyleSheet.create({
  container: {
    borderRadius: defaultRadius,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: basicColor,
  },
  back: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -999,
  },
});

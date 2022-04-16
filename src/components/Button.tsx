import {
  PressableProps,
  Pressable,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {basicColor} from '../static/color';

const defaultRadius = 5;
const timeout = 0;

interface BtnProps extends PressableProps {
  clickColor?: string;
  textColor?: string;
  unable?: boolean;
}

export default function Button(props: BtnProps) {
  const [size, setSize] = useState({width: 0, height: 0});

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

  const {
    style: userStyle,
    onPressIn,
    onPressOut,
    children,
    onLayout,
    unable,
    onPress,
  } = props;

  const uStyle: {[key: string]: any} = {...(userStyle?.valueOf() as Object)};

  useEffect(() => {
    unable ? moveIn() : moveOut();
  }, [unable]);

  return (
    <Pressable
      {...props}
      style={[{...ownstyles.container}, uStyle]}
      onPressIn={e => {
        !unable && moveIn();
        !unable && onPressIn && onPressIn(e);
      }}
      onLayout={a => {
        setSize({
          height: a.nativeEvent.layout.height,
          width: a.nativeEvent.layout.width,
        });
        onLayout && onLayout(a);
      }}
      onPress={e => {
        !unable && onPress && onPress(e);
      }}
      onPressOut={e => {
        !unable && moveOut();
        !unable && onPressOut && onPressOut(e);
      }}>
      {children}

      <Animated.View
        style={[
          {
            ...ownstyles.back,
            height: size.height,
            width: size.width,
            borderRadius: uStyle?.borderRadius || defaultRadius,
          },
          {opacity: shadow},
        ]}>
        <View />
      </Animated.View>
    </Pressable>
  );
}

Button.defaultProps = {
  unable: false,
};

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

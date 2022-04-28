import {Easing, Text, ViewProps, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {bs} from '../config/bs';
import uuid from 'uuid';

interface bulletScreenProps extends ViewProps {
  now: number;
  duration: number;
}

export default function BulletScreen(props: bulletScreenProps) {
  const {duration, now} = props;
  const nowOffset = useRef(now * 10);
  const tops = useRef<string[]>([]);
  const lastS = useRef<number>(0);
  const rollAnim = useRef(new Animated.Value(0)).current;
  const rollStart = (now: number) => {
    Animated.timing(rollAnim, {
      duration: 1000,
      toValue: now,
      useNativeDriver: false,
      easing: Easing.linear,
    }).start();
  };
  const rollNow = rollAnim.interpolate({
    inputRange: [0, duration],
    outputRange: ['0%', -(duration + 10) * 10 + '%'],
  });

  useEffect(() => {
    for (let i = 0; i < bs.length; i++) {
      tops.current.push(Math.random() * 100 + '%');
    }
  }, []);
  useEffect(() => {
    if (now === lastS.current+1) {
      rollStart(now);
    } else {
        Animated.timing(rollAnim, {
            duration: 0,
            toValue: now,
            useNativeDriver: false,
            easing: Easing.linear,
        }).start();
    }
    lastS.current=now
  }, [now]);
  return (
    <Animated.View
      style={[
        {
          height: '100%',
          position: 'absolute',
          zIndex: 9,
          width: (duration + 10) * 10 + '%',
          left: -nowOffset.current + '%',
          flexDirection: 'row',
        },
        {
          left: rollNow,
        },
      ]}>
      {bs.map((b, index) => {
        return (
          <Text
            key={uuid.v4()}
            style={{
              color: b.color,
              position: 'absolute',
              left: (b.duration / duration) * 100 + '%',
              top: tops.current[index],
              fontSize: 20,
            }}>
            {b.content}
          </Text>
        );
      })}
    </Animated.View>
  );
}

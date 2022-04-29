import {Easing, Text, ViewProps, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {bs as emptybs} from '../config/bs';
import uuid from 'uuid';
import {useAppSelector} from '../store/hooks';

interface bulletScreenProps extends ViewProps {
  now: number;
  duration: number;
  videoId: string;
  userId: string;
}

export default function BulletScreen(props: bulletScreenProps) {
  const {duration, now, videoId, userId} = props;
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
  const [bs, setBs] = useState(emptybs);
  const mybs = useAppSelector(s => s.bulletScreen);

  useEffect(() => {
    for (let i = 0; i < bs.length; i++) {
      tops.current.push(Math.random() * 50 + '%');
    }
  }, []);
  
  useEffect(() => {
    console.log(mybs);
    setBs([...bs, mybs]);
    tops.current.push(Math.random() * 50 + '%');
  }, [mybs]);

  useEffect(() => {
    if (now === lastS.current + 1) {
      rollStart(now);
    } else {
      Animated.timing(rollAnim, {
        duration: 0,
        toValue: now,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }
    lastS.current = now;
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
      {bs.map((b: any, index: number) => {
        return (
          videoId === b.videoId && (
            <Text
              key={uuid.v4()}
              style={{
                color: b.color,
                position: 'absolute',
                left: ((b.duration +10)/ duration) * 100 + '%',
                top: tops.current[index],
                fontSize: 20,
              }}>
              {b.content}
            </Text>
          )
        );
      })}
    </Animated.View>
  );
}

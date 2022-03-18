import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoShow from './VideoShow';
import {test} from '../api';

export default function Home() {
  const [time, setTime] = useState(60);
  const num = useRef(60);
  const iter = useRef<NodeJS.Timer>();

  useEffect(() => {
    iter.current = setInterval(() => {
      num.current--;
      setTime(num.current)
    }, 1000);
  }, []);

  // test().then(e => {
  //   console.log(e);
  // });
  fetch('https://192.168.180.94').then((v)=>{
    console.log(v);
  })

  useEffect(() => {
    if (num.current <= 50) {
      clearInterval(iter.current!);
    }
  });

  return (
    <View>
      <VideoShow />
    </View>
  );
}

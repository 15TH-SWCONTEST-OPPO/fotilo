import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-native';
import Input from '../components/Input';
import {test} from '../api';
import {passwordRule} from '../static/regex';

export default function Home() {
  const [time, setTime] = useState(60);
  const num = useRef(60);
  const iter = useRef<NodeJS.Timer>();

  useEffect(() => {
    iter.current = setInterval(() => {
      num.current--;
      setTime(num.current)
      console.log(time);
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(num.current);
    if (num.current <= 50) {
      clearInterval(iter.current!);
    }
  });

  return (
    <View>
      <Text>Home</Text>
      <Link to="/login">
        <Text>login</Text>
      </Link>
      <Text>{num.current}</Text>
      <View style={{flexDirection: 'row'}}>
        <Input
          rules={[true, passwordRule]}
          errText={['用户名或密码错误', '密码格式错误']}
        />
      </View>
    </View>
  );
}

import {View, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoShow from './VideoShow';
import {login, register, test} from '../api';
import axios from 'axios';

export default function Home() {
  const [time, setTime] = useState(60);
  const num = useRef(60);
  const iter = useRef<NodeJS.Timer>();

  return (
    <View>
      <VideoShow/>
    </View>
  );
}

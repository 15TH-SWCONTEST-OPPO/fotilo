import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Link} from 'react-router-native';
import Button from '../components/Button';
import Video from 'react-native-video';

export default function Home() {
  useEffect(() => {
    fetch('https://www.baidu.com/')
      .then(e => {
        console.log(e);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <View>
      <Text>Home</Text>
      <Link to="/login">
        <Text>login</Text>
      </Link>
      <View style={{flexDirection: 'row'}}>
        <Button style={{}}>
          <Text>123</Text>
        </Button>
      </View>
      <Video
        style={{width: '100%', height: '100%', backgroundColor: 'black'}}
        onLoad={e => {
          console.log(e);
        }}
        onError={e => {
          console.log(e);
        }}
        source={{
          uri: 'http://192.168.137.147:8003/file/286236897801465857.mp4',
        }}></Video>
    </View>
  );
}

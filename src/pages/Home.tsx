import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Link} from 'react-router-native';
import Input from '../components/Input';
import {test} from '../api'

export default function Home() {
  useEffect(() => {
    test().then((e) => {
      console.log(e);
    })
  }, []);

  return (
    <View>
      <Text>Home</Text>
      <Link to="/login">
        <Text>login</Text>
      </Link>
      <View style={{flexDirection: 'row'}}>
      </View>
    </View>
  );
}

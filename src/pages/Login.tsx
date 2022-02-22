import {View, Text, TouchableHighlight} from 'react-native';
import React from 'react';
import {useNavigate} from 'react-router-native';

export default function Login() {
  const navigation = useNavigate();

  const back = () => {
    navigation(-1);
  };

  return (
    <View>
      <Text>Login</Text>
      <TouchableHighlight onPress={back}>
        <Text>back</Text>
      </TouchableHighlight>
    </View>
  );
}

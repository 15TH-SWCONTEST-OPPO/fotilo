import {View, Text, TouchableHighlight, TextInput} from 'react-native';
import React from 'react';
import {useNavigate} from 'react-router-native';

export default function Register() {
  const navigation = useNavigate();

  const back = () => {
    navigation(-1);
  };

  return (
    <View>
      <Text>Register</Text>
      <TouchableHighlight onPress={back}>
        <Text>back</Text>
      </TouchableHighlight>
    </View>
  );
}

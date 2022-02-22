import {View, Text} from 'react-native';
import React from 'react';
import {Link} from 'react-router-native';

export default function StartP() {
  return (
    <View>
      <Link to="/login">
        <Text>login</Text>
      </Link>
      <Link to="/register">
        <Text>register</Text>
      </Link>
      <Link to="/home">
        <Text>home</Text>
      </Link>
    </View>
  );
}

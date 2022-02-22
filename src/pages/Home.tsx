import { View, Text } from 'react-native'
import React from 'react'
import {Link} from 'react-router-native';

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Link to="/login">
          <Text>
              login
          </Text>
      </Link>
    </View>
  )
}
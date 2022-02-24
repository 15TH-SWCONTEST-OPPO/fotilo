import {View, Text, ImageBackground, Dimensions, StatusBar} from 'react-native';
import React from 'react';
import {Link} from 'react-router-native';

export default function StartP() {
  const statusBarH = StatusBar.currentHeight || 0;
  const width = Dimensions.get('screen').width;
  const height =
    Dimensions.get('screen').height;
    console.log(statusBarH);
    
  return (
    <View>
      <StatusBar translucent/>
      <ImageBackground
        style={{width: width, height: height}}
        source={require('../static/img/background.gif')}>
        <View style={{height: statusBarH,width: width}}/>
        <Link to="/login">
          <Text>login</Text>
        </Link>
        <Link to="/register">
          <Text>register</Text>
        </Link>
        <Link to="/home">
          <Text>home{width}</Text>
        </Link>
      </ImageBackground>
    </View>
  );
}

import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import React from 'react';
import StatusBarSpace from '../components/StatusBarSpace';
import Video from 'react-native-video';
import VideoPlayer from '../components/VideoPlayer';

import Drawer from '../components/Drawer';

const windowWidth = Dimensions.get('screen').width;

// 视频横纵比
const scale = 2.8 / 5;

const Drawers=()=>{
  return (
    <Text style={{color: 'white'}}>
      hellowWolrd&nbsp;&nbsp;&nbsp;
    </Text>
  )
}

export default function VideoShow() {
  return (
    <View style={styles.background}>
      <StatusBarSpace />
      <VideoPlayer style={{width: windowWidth, height: windowWidth * scale}} />
      <Drawer position="top" drawers={<Drawers/>}>VideoShow</Drawer>
      <ScrollView 
      alwaysBounceVertical={false}
      style={styles.scrollView}>
        <Text style={styles.text}>
          
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor:'black'
  },
  container: {
    flex: 1,
  },
  scrollView: {
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 42,
    height: 2000
  },
});

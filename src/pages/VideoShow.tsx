import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import StatusBarSpace from '../components/StatusBarSpace'
import Video from 'react-native-video'
import VideoPlayer from '../components/VideoPlayer'

const windowWidth=Dimensions.get('screen').width

// 视频横纵比
const scale=2.8/5

export default function VideoShow() {
  return (
    <View style={styles.background}>
        <StatusBarSpace/>
        <VideoPlayer style={{width:windowWidth, height:windowWidth*scale}}/>
      <Text>VideoShow</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    background:{
        height:'100%'
    }
})
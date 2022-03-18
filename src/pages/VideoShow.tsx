import { View, Text, StyleSheet, Dimensions } from 'react-native'
import React from 'react'
import StatusBarSpace from '../components/StatusBarSpace'
import Video from 'react-native-video'
import VideoPlayer from '../components/VideoPlayer'

const windowWidth=Dimensions.get('screen').width

export default function VideoShow() {
  return (
    <View style={styles.background}>
        <StatusBarSpace/>
        <VideoPlayer />
      <Text>VideoShow</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    background:{
        backgroundColor:'black',
        height:'100%'
    }
})
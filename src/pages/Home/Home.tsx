import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import VideoCard from '../../components/VideoCardB';
import {videos} from '../../config/video';

export default function Home() {
  return (
    <View style={[styles.container]}>
      {videos.map(video => {
        return <VideoCard  key={video.videoId}  {...video} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    paddingBottom:5,
    backgroundColor:'#282828'
  }
})
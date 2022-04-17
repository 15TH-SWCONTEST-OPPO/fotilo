import {View, Text, StyleSheet} from 'react-native';
import React, { useEffect, useState} from 'react';
import VideoCard from '../../components/VideoCardB';
import {emptyVideo} from '../../config/video';
import { getVideoList } from '../../api';

export default function Home() {

  const [videos,setVideos]=useState(emptyVideo)

  useEffect(() =>{
    getVideoList(6).then((e)=>{
      setVideos(e.data.data)
    }).catch((e)=>{
      console.log(e);
    })
  },[])

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
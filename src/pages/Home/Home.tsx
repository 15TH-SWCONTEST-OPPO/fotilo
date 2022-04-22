import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import VideoCard from '../../components/VideoCardB';
import {emptyVideo} from '../../config/video';
import {getVideoList} from '../../api';
import {useAppSelector} from '../../store/hooks';

export default function Home() {
  const {videos: searchV} = useAppSelector(s => s.search);
  const [videos, setVideos] = useState(searchV);

  useEffect(() => {
    videos.length === 0 &&
      getVideoList(6)
        .then(e => {
          setVideos(e.data.data);
        })
        .catch(e => {
          console.log('home Error', e);
        });
  }, []);

  useEffect(() =>{
    setVideos(searchV);
  },[searchV])

  return (
    <View style={[styles.container]}>
      {videos.map(video => {
        return <VideoCard key={video.videoId} {...video} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    backgroundColor: '#282828',
  },
});

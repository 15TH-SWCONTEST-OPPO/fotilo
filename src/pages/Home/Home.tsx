import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoCard from '../../components/VideoCardB';
import {emptyVideo} from '../../config/video';
import {getVideoList} from '../../api';
import {useAppSelector} from '../../store/hooks';
import {basicColor} from '../../static/color';

const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

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

  useEffect(() => {
    setVideos(searchV);
  }, [searchV]);

  // 刷新
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(8000).then(() => setRefreshing(false));
  }, []);
  // const tltheight

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[basicColor]}
        />
      }
      onScroll={e => {
        const val = e.nativeEvent;
        if (
          Math.abs(
            val.contentOffset.y +
              val.layoutMeasurement.height -
              val.contentSize.height,
          ) < 1e-3
        ) {
          console.log('lazyload');
        }
      }}>
      <View style={[styles.container]}>
        {videos.map(video => {
          return <VideoCard key={video.videoId} {...video} />;
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 5,
    backgroundColor: '#282828',
  },
  flush: {
    width: '100%',
    height: 50,
    backgroundColor: '#3a3a3a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

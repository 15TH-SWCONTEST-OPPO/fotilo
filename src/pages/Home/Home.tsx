import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VideoCard from '../../components/VideoCardB';
import {getVideoList} from '../../api';
import {useAppSelector} from '../../store/hooks';
import {basicColor} from '../../static/color';
import uuid from 'uuid'

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
    getVideoList(6)
      .then(e => {
        setVideos(e.data.data);
        setRefreshing(false);
      })
      .catch(e => {
        console.log('home Error', e);
      });
  }, []);
  // 懒加载
  const lazyload = (e: any) => {
    const val = e.nativeEvent;
    if (
      Math.abs(
        val.contentOffset.y +
          val.layoutMeasurement.height -
          val.contentSize.height,
      ) < 1e-3
    ) {
      getVideoList(6)
        .then(e => {
          console.log(e.data.data);
          
          setVideos([...videos, ...e.data.data]);
          setRefreshing(false);
        })
        .catch(e => {
          console.log('home Error', e);
        });
    }
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[basicColor]}
        />
      }
      onScroll={lazyload}>
      <View style={[styles.container]}>
        {videos.map(video => {
          return <VideoCard key={uuid.v4()} {...video} />;
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

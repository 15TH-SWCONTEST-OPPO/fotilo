import {View, Text, PanResponder, StyleSheet, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoPlayer from 'react-native-video';
import {getVideo, getVideoList} from '../../api';
import {videoType} from '../../static/types';
import {emptyVideo} from '../../config/video';

export default function Video() {
  const videoNum = useRef(0);
  const videos = useRef<Array<videoType>>(emptyVideo);
  const dragging = useRef<boolean>(false);
  const [video, setVideo] = useState<videoType>(emptyVideo[0]);

  const cutAnim=useRef(new Animated.Value(0)).current
  

  // 暂停

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, b) => {
        if (b.dy > 0) {
          if (!dragging.current) {
            dragging.current = true;
            console.log(videos);
            
            if (videoNum.current === 0) {
              getVideoList(1)
              .then(e => {
                  videos.current = [e.data.data[0],...videos.current];
                  setVideo(videos.current[0]);
                })
                .catch(e => {
                  console.log('video videolist error', e);
                });
            } else {
              setVideo(videos.current[videoNum.current-1]);
              videoNum.current -= 1
            }
          }
        } else {
          if (!dragging.current) {
            console.log(videos);
            dragging.current = true;
            if (videoNum.current >= videos.current.length-1) {
            getVideoList(1)
              .then(e => {
                videos.current = [...videos.current,e.data.data[0] ];
                setVideo(videos.current[videoNum.current+1]);
                videoNum.current += 1;
              })
              .catch(e => {
                console.log('video getlist error', e);
              });
          }else{

            setVideo(videos.current[videoNum.current+1]);
            videoNum.current += 1
          }
        }}
      },
      onPanResponderRelease: () => {
        dragging.current = false;
      },
    }),
  ).current;

  useEffect(() => {
    getVideoList(1)
      .then(e => {
        setVideo(e.data.data[0]);
        videos.current = [e.data.data[0]];
      })
      .catch(e => {
        console.log('video get 2nd list error', e);
      });
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.space} />
      {video.videoId !== '' && (
        <VideoPlayer
          style={[styles.videoPlayer]}
          source={{uri: video.videoURL}}
        />
      )}
      <View style={styles.space} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    flexGrow: 1,
  },
  space: {
    flexGrow: 1,
  },
});

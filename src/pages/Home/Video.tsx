import {View, Text, PanResponder, StyleSheet, Animated} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoPlayer from 'react-native-video';
import {getVideo, getVideoList} from '../../api';
import {videoType} from '../../static/types';
import {emptyVideo, videos as vs} from '../../config/video';
import Button from '../../components/Button';
import {FreePause, Loading} from '../../static/myIcon';
import {Slider} from 'native-base';

export default function Video() {
  const videoNum = useRef(0);
  const videos = useRef<Array<videoType>>(emptyVideo);
  const dragging = useRef<boolean>(false);
  const [video, setVideo] = useState<videoType>(emptyVideo[0]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);

  /* 
    动画
  */
  const cutAnim = useRef(new Animated.Value(0)).current;

  const cutIn = () => {};

  const cutOut = () => {};

  // 暂停
  const [pause, setPause] = useState(false);
  // 加载
  const [loading, setLoading] = useState(false);

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
                  videos.current = [e.data.data[0], ...videos.current];
                  setVideo(videos.current[0]);
                  setDuration(videos.current[0].duration);
                  setProgress(0);
                })
                .catch(e => {
                  console.log('video videolist error', e);
                });
            } else {
              setDuration(videos.current[videoNum.current - 1].duration);
              setProgress(0);
              setVideo(videos.current[videoNum.current - 1]);
              videoNum.current -= 1;
            }
          }
        } else {
          if (!dragging.current) {
            dragging.current = true;
            if (videoNum.current >= videos.current.length - 1) {
              getVideoList(1)
                .then(e => {
                  videos.current = [...videos.current, e.data.data[0]];
                  setVideo(videos.current[videoNum.current + 1]);
                  videoNum.current += 1;
                })
                .catch(e => {
                  console.log('video getlist error', e);
                });
            } else {
              setVideo(videos.current[videoNum.current + 1]);
              videoNum.current += 1;
            }
          }
        }
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
      {pause && (
        <View
          style={{
            position: 'absolute',
            zIndex: 99,
            backgroundColor: '#c0c0c093',
            borderRadius: 10,
            width: 90,
            height: 90,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FreePause size={20} />
        </View>
      )}
      {loading && (
        <View
          style={{
            position: 'absolute',
            zIndex: 99,
            backgroundColor: '#c0c0c093',
            borderRadius: 10,
            width: 90,
            height: 90,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Loading size={20} />
        </View>
      )}

      <Button
        style={{width: '100%', height: '100%', backgroundColor: 'transparent'}}
        onPress={() => {
          setPause(!pause);
        }}>
        <View style={styles.space} />
        <View style={[styles.videoPlayerC]}>
          {video.videoId !== '' && (
            <VideoPlayer
              onProgress={e => {
                setProgress(Math.floor(e.currentTime));
              }}
              resizeMode="contain"
              style={[styles.videoPlayer]}
              source={{uri: video.videoURL}}
              repeat
              paused={pause}
              onLoadStart={() => {
                setLoading(true);
              }}
              onLoad={() => {
                setLoading(false);
              }}
            />
          )}
        </View>
        <View style={styles.space} />
      </Button>
      <View>
        <Slider
          w="3/5"
          maxW="300"
          defaultValue={0}
          minValue={0}
          maxValue={duration || 1}
          value={progress}
          accessibilityLabel="hello world"
          step={1}>
          <Slider.Track>
            <Slider.FilledTrack />
          </Slider.Track>
          <Slider.Thumb />
        </Slider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  videoPlayer: {
    width: '100%',
    flexGrow: 1,
  },
  videoPlayerC: {
    flexGrow: 1,
    width: '100%',
  },
  space: {
    flexGrow: 1,
  },
});

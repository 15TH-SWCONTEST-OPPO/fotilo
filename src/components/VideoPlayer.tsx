import {
  View,
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  Text,
  StatusBar,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import {useNavigate} from 'react-router-native';
// 渐变
import LinearGradient from 'react-native-linear-gradient';
// 屏幕旋转
import {Begin, Progress, Pause, Full} from '../static/myIcon';
import {ArrowBackIcon, Slider} from 'native-base';

import Orientation from 'react-native-orientation-locker';

import getTime from '../utils/getTime';


interface VideoPlayerProps {
  style?: ViewStyle;
}

const barColor = 'rgba(0,0,0,0.5)';

export default function VideoPlayer(props: VideoPlayerProps) {
  const navigate = useNavigate();

  /* 
    播放器状态
  */

  // 用于调整时间
  const myVideo = useRef<Video | null>();

  // 视频时间
  const [duration, setDuration] = useState(0);

  // 播放暂停
  const [pause, setPause] = useState(false);

  // 音量
  const [audio, setAudio] = useState(1);

  // 倍速
  const [rate, setRate] = useState(1);

  // 当前高度
  const height = props.style?.height;

  // 进度
  const [progress, setProgress] = useState(0);

  // 全屏
  const [full, setFull] = useState(0);

  /* 
    点击动画
  */
  const inAnim = useRef(
    new Animated.Value(height ? -0.2 * (height as number) : -20),
  ).current;

  const cutIn = () => {
    Animated.timing(inAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const cutOut = () => {
    Animated.timing(inAnim, {
      toValue: -0.2 * (height as number),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // 判断当前点击状态
  const [showControl, setShowControl] = useState<boolean>(false);

  const {style} = props;

  return (
    <View
      style={[
        {...style, overflow: 'hidden',position: 'absolute'},
        {transform: [{rotate: '90deg'}]},
      ]}>
      {/* 
        头部条
      */}
      <Animated.View style={[styles.header, {top: inAnim}]}>
        <LinearGradient
          style={styles.linear}
          colors={[barColor, 'transparent']}>
          <Pressable
            onPress={() => {
              navigate(-1);
            }}>
            <ArrowBackIcon style={{color: 'white'}} />
          </Pressable>
        </LinearGradient>
      </Animated.View>

      {/* 视频 */}
      <Pressable
        onPress={() => {
          if (showControl) cutOut();
          else {
            cutIn();
          }
          setShowControl(!showControl);
        }}>
        <Video
          source={{
            uri: 'https://vd3.bdstatic.com/mda-ka966fpjqpgy5a4e/v1-cae/sc/mda-ka966fpjqpgy5a4e.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1647591178-0-0-7cbba8d1ee38d14e310f7eb9d76d4a07&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=2578197149&vid=7374485987139761484&abtest=100815_1-17451_2&klogid=2578197149',
          }}
          style={{backgroundColor: 'black', width: '100%', height: '100%'}}
          resizeMode="contain"
          repeat
          volume={audio}
          rate={rate}
          paused={pause}
          ref={e => {
            myVideo.current = e;
          }}
          onProgress={e => {
            setProgress(Math.floor(e.currentTime));
          }}
          onLoad={e => {
            setDuration(Math.floor(e.duration));
          }}
        />
      </Pressable>

      {/* 底部条 */}
      <Animated.View style={[styles.footer, {bottom: inAnim}]}>
        <LinearGradient
          style={{...styles.linear}}
          colors={['transparent', barColor]}>
          {/* 暂停键 */}
          <Pressable
            onPress={() => {
              setPause(!pause);
            }}
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <Progress size={8} />
            <View
              style={{
                ...styles.startBtn,
                top: pause ? 10 : 12,
                left: pause ? 4 : 6,
              }}>
              {pause ? (
                <Begin size={4} color="black" />
              ) : (
                <Pause size={3} color="black" />
              )}
            </View>
          </Pressable>

          {/*进度条  */}
          <View style={styles.progressBar}>
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
            <Text style={{color: 'white'}}>
              {getTime(progress)}/{getTime(duration)}&nbsp;&nbsp;
            </Text>
            <View />
          </View>

          {/* 全屏 */}
          <Pressable
            onPress={() => {
              Orientation.lockToLandscape()
            }}>
            <Full size={5} />
          </Pressable>
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  footer: {
    width: '100%',
    height: '20%',
    position: 'absolute',
    zIndex: 999,
  },
  header: {
    width: '100%',
    height: '20%',
    position: 'absolute',
    top: 0,
    zIndex: 999,
  },
  linear: {
    height: '100%',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 7,
  },
  startBtn: {
    position: 'absolute',
    top: 10,
    left: 4,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

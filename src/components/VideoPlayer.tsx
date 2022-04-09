import {
  View,
  Animated,
  Pressable,
  StyleSheet,
  ViewStyle,
  Text,
  StatusBar,
  Dimensions,
  PanResponder,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Video from 'react-native-video';
import {useNavigate} from 'react-router-native';
// 渐变
import LinearGradient from 'react-native-linear-gradient';
// 屏幕旋转
import {Begin, Progress, Pause, Full} from '../static/myIcon';
import {ArrowBackIcon, Slider} from 'native-base';
import uuid from 'uuid';

import Orientation from 'react-native-orientation-locker';

import getTime from '../utils/getTime';
import setPoint from '../utils/setPoint';
import Drawer from './Drawer';

import {basicColor} from '../static/color';

// 音量

interface VideoPlayerProps {
  style?: ViewStyle;
  title?: string;
}

// 屏幕长宽
const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

// statusBar的高度
const statusH = StatusBar.currentHeight || 0;

// 上下bar的颜色
const barColor = 'rgba(0,0,0,0.5)';

// 倍速的数组
const rates = ['2.0x', '1.5x', '1.25x', '1.0x', '0.5x'];

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
  const width = props.style?.width;

  // 进度
  const [progress, setProgress] = useState(0);

  // 全屏
  const [full, setFull] = useState(false);

  // 视频标题
  const {title} = props;

  /* 
  倍速扩展框
   */
  // 组件
  const RateDrawers = () => (
    <View style={{width: 40, height: 130, justifyContent: 'center'}}>
      <View
        style={{
          width: 40,
          backgroundColor: 'rgba(0,0,0,.5)',
          borderRadius: 2,
          alignItems: 'center',
        }}>
        {rates.map(e => {
          return (
            <Pressable
              key={uuid.v4()}
              style={{height: 25}}
              onPress={() => {
                setRate(parseFloat(e));
              }}>
              <Text
                style={{color: setPoint(rate) === e ? basicColor : 'white'}}>
                {e}&nbsp;
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  /* 
    点击动画
  */
  const inAnim = useRef(
    new Animated.Value(
      full
        ? height
          ? -0.2 * (height as number)
          : -20
        : height
        ? -0.2 * (height as number)
        : -20,
    ),
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
      toValue: -0.4 * (height as number),
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // 判断当前点击状态
  const [showControl, setShowControl] = useState<boolean>(false);

  const [size, setSize] = useState({
    height: props.style?.height || 0,
    width: props.style?.width || 0,
  });

  /* 
    触摸
  */

  const [drag, setDrag] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setDrag(true)
      },
      onPanResponderMove: (_, b) => {
        const a = audio;
        console.log(Math.min(1,a - b.dy / ((full ? windowWidth : size.height) as number)));
        setAudio(Math.min(1,a - b.dy / ((full ? windowWidth : size.height) as number)));
      },
      onPanResponderRelease: () => {
        
      },
    }),
  ).current;

  const {style} = props;

  return (
    <>
      <View
        style={[
          {
            ...style,
            overflow: 'hidden',
            position: full ? 'absolute' : undefined,
            zIndex: 999,
            height: full ? windowWidth : size.height,
            width: full ? windowHeight - statusH : size.width,
          },
        ]}
        {...panResponder.panHandlers}>
        {/* 
          滚动判断
        */}
        <Text 
        style={{
          color: 'white'
        }}
        >
          {audio}
        </Text>
        {/* 
        头部条
      */}
        <Animated.View style={[styles.header, {top: inAnim}]}>
          <LinearGradient
            style={styles.linear}
            colors={[barColor, 'transparent']}>
            <Pressable
              onPress={() => {
                if (full) {
                  Orientation.lockToPortrait();
                  setFull(!full);
                  StatusBar.setHidden(!full);
                  return;
                }
                navigate(-1);
                Orientation.lockToPortrait();
                StatusBar.setHidden(false);
              }}>
              <ArrowBackIcon style={{color: 'white'}} />
            </Pressable>
            {full && <Text style={{color: 'white'}}>{title}</Text>}
            <View />
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

            {full ? (
              <>
                {/* 
              倍速
            */}
                <Drawer
                  showDrawer={showControl}
                  position="top"
                  drawers={<RateDrawers />}>
                  <Text style={{color: 'white'}}>{setPoint(rate)}&nbsp;</Text>
                </Drawer>
              </>
            ) : (
              <>
                {/* 全屏 */}
                <Pressable
                  onPress={() => {
                    StatusBar.setHidden(!full);
                    if (full) Orientation.lockToPortrait();
                    else Orientation.lockToLandscape();
                    setFull(!full);
                  }}>
                  <Full size={5} />
                </Pressable>
              </>
            )}
            <View />
          </LinearGradient>
        </Animated.View>
      </View>
    </>
  );
}

VideoPlayer.defaultProps = {
  title: '未命名标题',
};

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

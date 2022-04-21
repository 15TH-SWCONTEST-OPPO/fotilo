import {
  View,
  Animated,
  Pressable as Button,
  StyleSheet,
  ViewStyle,
  Text,
  StatusBar,
  Dimensions,
  PanResponder,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Video from 'react-native-video';
import {useLocation, useNavigate} from 'react-router-native';
// 渐变
import LinearGradient from 'react-native-linear-gradient';
import {Begin, Progress, Pause, Full, Audio, Loading} from '../static/myIcon';
import {ArrowBackIcon, Slider} from 'native-base';
import uuid from 'uuid';

// 屏幕旋转
import Orientation from 'react-native-orientation-locker';

import getTime from '../utils/getTime';
import setPoint from '../utils/setPoint';
import Drawer from './Drawer';

import {basicColor} from '../static/color';

// 系统设置
import SystemSetting from 'react-native-system-setting';

interface VideoPlayerProps {
  style?: ViewStyle;
  title?: string;
  videoUrl: string;
  lastUrl: string;
}

// 屏幕长宽
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  const [audio, setAudio] = useState(0.3);
  SystemSetting.getVolume().then(volume => {
    setAudio(volume);
  });

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
  const {title, videoUrl, lastUrl} = props;

  

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
            <Button
              key={uuid.v4()}
              style={{height: 25}}
              onPress={() => {
                setRate(parseFloat(e));
              }}>
              <Text
                style={{color: setPoint(rate) === e ? basicColor : 'white'}}>
                {e}&nbsp;
              </Text>
            </Button>
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
    播放器手势响应
  */

  //设置是否拖拽
  const [drag, setDrag] = useState(false);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);

  useEffect(() => {
    const daudio = dy === 0 ? 0 : dy < 0 ? -0.1 : 0.1;
    const volume = audio;
    SystemSetting.setVolume(audio - daudio);
    setAudio(volume - daudio);
  }, [dy]);

  useEffect(() => {}, [dx]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event, b) => {
        return true;
      },
      onMoveShouldSetPanResponder: (a,b) => {
        if((Math.abs(b.dx) > 5) || (Math.abs(b.dy) > 5)){
          return true
        }else{
          return false
        }
      },
      onPanResponderGrant: () => {
        setDrag(true);
      },
      onPanResponderMove: (_, b) => {
        setDx(b.dx);
        setDy(
          Math.floor(
            (b.dy / ((full ? windowWidth : size.height) as number)) * 10,
          ),
        );
      },
      onPanResponderRelease: () => {
        setDrag(false);
        setDx(0);
        setDy(0);
      },
    }),
  ).current;

  const {style} = props;

  /* 
    loading 设置
  */
  const [isLoading, setIsLoading] = useState(false);

  return (
    <View
      style={[
        {
          ...style,
          overflow: 'hidden',
          position: full ? 'absolute' : undefined,
          zIndex: 999,
        },
        {
          height: full ? windowWidth : size.height,
          width: full ? windowHeight - statusH : size.width,
        },
      ]}
      {...panResponder.panHandlers}
      >
      
      {/* 
          滚动判断
        */}
      {dy !== 0 && (
        <View
          style={{
            position: 'absolute',
            zIndex: 99,
            left: ((full ? windowHeight - statusH : size.width) as number) / 2,
            top: ((full ? windowWidth : size.height) as number) / 2,
            backgroundColor: 'black',
            opacity: 0.5,
            borderRadius: 10,
          }}>
          <Audio />
        </View>
      )}
      {/* 
        头部条
      */}
      
      <Animated.View style={[styles.header, {top: inAnim}]}>
        <LinearGradient
          style={styles.linear}
          colors={[barColor, 'transparent']}>
          <Button
            onPress={() => {
              if (full) {
                Orientation.lockToPortrait();
                setFull(!full);
                StatusBar.setHidden(!full);
                return;
              }
              navigate(lastUrl);
              Orientation.lockToPortrait();
              StatusBar.setHidden(false);
            }}>
            <ArrowBackIcon style={{color: 'white'}} />
          </Button>
          {full && <Text style={{color: 'white'}}>{title}</Text>}
          <View />
        </LinearGradient>
      </Animated.View>

      {/* 视频 */}
      <Button
        onPress={() => {
          if (showControl) cutOut();
          else {
            cutIn();
          }
          setShowControl(!showControl);
        }}>
          {isLoading && (
        <View
          style={[
            styles.loading,
            {
              height: full ? windowWidth : size.height,
              width: full ? windowHeight - statusH : size.width,
            },
          ]}>
          <Loading size={10} />
          <Text style={[styles.loadingT]}>Loading...&nbsp;</Text>
        </View>
      )}
        <Video
          source={{
            uri: videoUrl,
          }}
          style={{backgroundColor: 'black', width: '100%', height: '100%'}}
          resizeMode="contain"
          repeat
          rate={rate}
          paused={pause}
          ref={e => {
            myVideo.current = e;
          }}
          onProgress={e => {
            setProgress(Math.floor(e.currentTime));
          }}
          onLoadStart={() => {
            setIsLoading(true);
          }}
          onLoad={e => {
            setDuration(Math.floor(e.duration));
            setIsLoading(false);
          }}
        />
      </Button>

      {/* 底部条 */}
      <Animated.View style={[styles.footer, {bottom: inAnim}]}>
        <LinearGradient
          style={{...styles.linear}}
          colors={['transparent', barColor]}>
          {/* 暂停键 */}
          <Button
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
          </Button>

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
              {getTime(progress)}/{getTime(duration)}&nbsp;&nbsp;&nbsp;
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
              <Button
                onPress={() => {
                  StatusBar.setHidden(!full);
                  if (full) Orientation.lockToPortrait();
                  else Orientation.lockToLandscape();
                  setFull(!full);
                }}>
                <Full size={5} />
              </Button>
            </>
          )}
          <View />
        </LinearGradient>
      </Animated.View>
    </View>
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
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.8,
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingT: {
    color: 'white',
  },
});

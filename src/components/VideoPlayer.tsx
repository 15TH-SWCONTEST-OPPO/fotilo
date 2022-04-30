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
import {useNavigate} from 'react-router-native';
// 渐变
import LinearGradient from 'react-native-linear-gradient';
import {
  Begin,
  Progress,
  Pause,
  Full,
  Audio,
  Loading,
  Bullet,
} from '../static/myIcon';
import {ArrowBackIcon, Slider, Switch} from 'native-base';

// 屏幕旋转
import Orientation from 'react-native-orientation-locker';

import getTime from '../utils/getTime';
import setPoint from '../utils/setPoint';
import {basicColor, bulletColors} from '../static/color';

// 系统设置
import SystemSetting from 'react-native-system-setting';
import BulletScreen from './BulletScreen';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {set} from '../store/features/bulletScreenSlice';
import Input from './Input';
import {setBS} from '../api';

interface VideoPlayerProps {
  style?: ViewStyle;
  title?: string;
  videoUrl: string;
  lastUrl: string;
  videoId: number;
  // 当前播放时间
  onProgress?: (e: any) => any;
  // 弹幕展示
  onShowChange?: (e: any) => any;
  // 弹幕展示
  bss: boolean;
}

// 屏幕长宽
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// statusBar的高度
const statusH = StatusBar.currentHeight || 0;

// 上下bar的颜色
const barColor = 'rgba(0,0,0,0.5)';

const colorBarWidth = 198;

// 转16进制
const toHStr = (val: number) => {
  if (Math.floor(val / 16) == 0) return '0' + val.toString(16);
  else return val.toString(16);
};

// 颜色选择
const selectC = (val: number): string => {
  let res = '#';
  const num =
    Math.ceil(val / (colorBarWidth / 6)) - 1 === -1
      ? 0
      : Math.ceil(val / (colorBarWidth / 6)) - 1;

  const hex = Math.floor(
    ((val % (colorBarWidth / 6)) / (colorBarWidth / 6)) * 256,
  );
  switch (num) {
    case 0:
      res += 'ff' + toHStr(hex) + '00';
      break;
    case 1:
      res += toHStr(256 - hex) + 'ff' + '00';
      break;
    case 2:
      res += '00' + 'ff' + toHStr(hex);
      break;
    case 3:
      res += '00' + toHStr(256 - hex) + 'ff';
      break;
    case 4:
      res += toHStr(hex) + '00' + 'ff';
      break;
    case 5:
      res += 'ff' + '00' + toHStr(256 - hex);
      break;
    case 6:
      res += 'ff0000';
      break;
  }
  return res;
};

export default function VideoPlayer(props: VideoPlayerProps) {
  const dispatch = useAppDispatch();

  const {userId} = useAppSelector(s => s.user);

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
  const rPause = useRef(false);

  // 音量
  const [audio, setAudio] = useState(0.3);
  SystemSetting.getVolume().then(volume => {
    setAudio(volume);
  });
  const nowA = useRef<number[]>([]);
  useEffect(() => {
    for (let i = 1; i <= 10; i++) {
      nowA.current.push(i);
    }
  }, []);

  // 倍速
  const [rate, setRate] = useState(1);

  // 当前高度
  const height = props.style?.height;
  const width = props.style?.width;

  // 进度
  const [progress, setProgress] = useState(0);
  const durationF = useRef(0);

  // 全屏
  const [full, setFull] = useState(false);

  // 视频标题
  const {title, videoUrl, lastUrl, videoId, onProgress} = props;

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
  const nowClick = useRef(true);

  const [size, setSize] = useState({
    height: props.style?.height || 0,
    width: props.style?.width || 0,
  });

  /* 
    播放器手势响应
  */

  //设置是否拖拽
  const [drag, setDrag] = useState(false);
  const [dy, setDy] = useState(0);
  const lastDy = useRef(0);
  const [dx, setDx] = useState(0);
  const xChange = useRef(false);
  const yChange = useRef(false);

  useEffect(() => {
    if (!isSpeeding.current) {
      const daudio =
        lastDy.current - dy === 0 ? 0 : lastDy.current - dy > 0 ? -0.1 : 0.1;
      lastDy.current = dy;
      const volume = audio;
      SystemSetting.setVolume(audio - daudio);
      setAudio(volume - daudio);
    } else {
      const daudio =
        lastDy.current - dy === 0 ? 0 : lastDy.current - dy > 0 ? -0.25 : 0.25;
      lastDy.current = dy;
      const volume = rate;
      setRate(Math.max(0.25, volume - daudio));
    }
  }, [dy]);

  useEffect(() => {
    const dpro = dx === 0 ? 0 : dx < 0 ? 2 : -2;
    const nowP = progress;
    myVideo.current?.seek(Math.min(Math.max(nowP - dpro, 0), duration));
    setProgress(Math.min(Math.max(nowP - dpro, 0), duration));
  }, [dx]);

  /* 
    延时
  */
  //  长按
  const timer = useRef<NodeJS.Timer | null>();
  //  单击
  const clickT = useRef<NodeJS.Timer | null>();
  // 正在加速
  const isSpeeding = useRef(false);
  //  正在滑动
  const isGragging = useRef(false);

  // 手势操作
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event, b) => {
        // 单击去除右边栏
        aCutOut();
        return true;
      },
      onMoveShouldSetPanResponder: (a, b) => {
        // 按压大小判断
        if (Math.abs(b.dx) > 5 || Math.abs(b.dy) > 5) {
          return true;
        } else {
          return false;
        }
      },
      onPanResponderGrant: () => {
        //
        setDrag(true);

        // 加速延时器
        timer.current = setTimeout(() => {
          setRate(2);
          isSpeeding.current = true;
        }, 1000);
      },
      onPanResponderMove: (_, b) => {
        // 判断点击效果，如果移动，点击取消
        if (clickT.current != null) {
          clearTimeout(clickT.current);
          clickT.current = null;
        }

        // 横向移动
        if (Math.abs(b.dx) > 5 && !yChange.current && !isSpeeding.current) {
          timer.current && clearTimeout(timer.current);
          timer.current = null;
          xChange.current = true;
          setDx(b.dx / ((full ? windowHeight : size.width) as number));
          isGragging.current = true;
        }

        // 纵向移动
        if (Math.abs(b.dy) > 5 && !xChange.current && !isSpeeding.current) {
          timer.current && clearTimeout(timer.current);
          timer.current = null;
          yChange.current = true;
          setDy(
            Math.floor(
              (b.dy / ((full ? windowWidth : size.height) as number)) * 10,
            ),
          );
          isGragging.current = true;
        }

        // 加速横向移动
        if (Math.abs(b.dy) > 2 && isSpeeding.current) {
          setDy(
            Math.floor(
              (b.dy / ((full ? windowWidth : size.height) as number)) * 10,
            ),
          );
        }
      },

      onPanResponderRelease: () => {
        // 双击判断
        if (clickT.current && clickT.current != null) {
          clearTimeout(clickT.current);
          clickT.current = null;
          rPause.current = !rPause.current;
          setPause(rPause.current);
        } else if (!isSpeeding.current && !isGragging.current) {
          // 单击判断
          clickT.current = setTimeout(() => {
            nowClick.current = !nowClick.current;
            if (nowClick.current) cutOut();
            else {
              cutIn();
            }
            clickT.current = null;
          }, 300);
        }

        // 清除加速定时器
        if (timer.current && timer.current !== null) {
          clearTimeout(timer.current);
          timer.current = null;
          if (isSpeeding.current) setRate(1);
        }
        isSpeeding.current = false;
        isGragging.current = false;
        setDrag(false);
        setDy(0);
        setDx(0);
        lastDy.current = 0;
        xChange.current = false;
        yChange.current = false;
      },
    }),
  ).current;

  const {style, onShowChange, bss} = props;

  /* 
    loading 设置
  */
  const [isLoading, setIsLoading] = useState(false);

  /* 
    进度条拖动
  */
  const [isDP, setIsDP] = useState(false);

  /* 
    右边栏展示
  */
  const [isBullet, setIsBullet] = useState(false);
  const rates = useRef([2, 1.5, 1.25, 1, 0.5]).current;
  const rWidth = useRef(new Animated.Value(0)).current;
  const aCutIn = () => {
    Animated.timing(rWidth, {
      toValue: 200,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const aCutOut = () => {
    Animated.timing(rWidth, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    onProgress && onProgress(progress);
  }, [progress]);

  /* 
    颜色选择器
  */
  // 供选择的索引
  const [colorIndex, setColorIndex] = useState(11);
  // 供选择的颜色
  const colorSelect = useRef(bulletColors).current;
  //  是否是自定义
  const isCustom = useRef(false);
  // 自选颜色
  const [customColor, setCustomColor] = useState('#ff0000');
  // 当前颜色
  const [bColor, setBcolor] = useState('#000000');
  // 横向偏移量
  const colordx = useRef(new Animated.Value(0)).current;
  // 累计位移
  const simulateX = useRef(0);
  // 颜色拖动
  const colorResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (a, b) => {
        return true;
      },
      onMoveShouldSetPanResponder: (a, b) => {
        return true;
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (a, b) => {
        colordx.setValue(
          Math.min(Math.max(b.dx + simulateX.current, 0), colorBarWidth),
        );
      },
      onPanResponderRelease: (a, b) => {
        simulateX.current = Math.min(
          Math.max(b.dx + simulateX.current, 0),
          colorBarWidth,
        );

        colordx.flattenOffset();
      },
    }),
  ).current;

  useEffect(() => {
    isCustom.current && setBcolor(customColor);
  }, [customColor]);

  const bulletT = useRef('');
  const [dValue, setDValue] = useState<undefined | string>(undefined);
  const [showBs, setShowBs] = useState(true);
  useEffect(() => {
    setShowBs(bss);
  }, [bss]);

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
      ]}>
      {/* 
          音量icon
        */}
      {dy !== 0 && isGragging.current && (
        <View
          style={{
            position: 'absolute',
            zIndex: 999,
            left:
              (((full ? windowHeight - statusH : size.width) as number) - 55) /
              2,
            top: (((full ? windowWidth : size.height) as number) - 55) / 2,
            backgroundColor: '#00000080',
            borderRadius: 10,
            width: 100,
            height: 100,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Audio />
          <View style={{width: 20, height: 20}} />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'stretch',
            }}>
            {nowA.current.map(a => {
              return (
                <View
                  style={{
                    width: 8,
                    marginHorizontal: 1,
                    height: 4,
                    backgroundColor:
                      Math.ceil(audio * 10) >= a ? 'white' : '#ffffff40',
                  }}
                />
              );
            })}
          </View>
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
          {full && (
            <Text style={{color: 'white'}}>
              {title}&nbsp;&nbsp;&nbsp;&nbsp;
            </Text>
          )}
          <View />
        </LinearGradient>
      </Animated.View>
      {/* 右侧栏 */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            height: '100%',
            width: 180,
            backgroundColor: 'black',
            zIndex: 99999,
            right: 0,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            overflow: 'hidden',
          },
          {width: rWidth},
        ]}>
        {isBullet ? (
          <View>
            {/* 
            颜色选择器
          */}

            <View
              style={[
                {
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  overflow: 'hidden',
                },
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '80%',
                  justifyContent: 'space-between',
                }}>
                <Input
                  onChangeText={e => {
                    bulletT.current = e;
                  }}
                  value={dValue}
                  iconSide="none"
                  placeholder="发一条弹幕吧"
                  placeholderTextColor="white"
                  textStyle={{color: 'white'}}
                  containerStyle={{width: 110, borderRadius: 3, height: 38}}
                />
                <View style={{width: 1, height: 2}} />
                <Button
                  onPress={() => {
                    dispatch(
                      set({
                        content: bulletT.current,
                        color: bColor,
                        duration: progress,
                        userId: userId || '',
                        videoId: videoId,
                      }),
                    );
                    setDValue('');
                    setTimeout(() => {
                      setDValue(undefined);
                    });
                    setBS({
                      content: bulletT.current,
                      color: bColor,
                      duration: progress,
                      videoId: videoId,
                    })
                      .then(e => {
                        console.log(e);
                      })
                      .catch(e => {
                        console.log(e);
                      });
                    aCutOut();
                  }}
                  style={{
                    borderColor: 'white',
                    borderWidth: 1,
                    borderRadius: 4,
                    height: 28,
                  }}>
                  <Text style={{color: 'white', fontSize: 18}}>发布</Text>
                </Button>
              </View>
              {/* 
            供选择的颜色
            */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  width: '60%',
                }}>
                {bulletColors.map((c, index) => {
                  return (
                    <View style={{padding: 3}}>
                      <Button
                        style={{
                          width: 30,
                          height: 30,
                          borderRadius: 15,
                          backgroundColor: c,
                          borderWidth: 2,
                          borderColor:
                            colorIndex === index ? 'white' : '#ab9b9b',
                        }}
                        onPress={() => {
                          setColorIndex(index);
                          setBcolor(colorSelect[index]);
                          isCustom.current = false;
                        }}
                      />
                    </View>
                  );
                })}
              </View>
              {/* 
              自定义颜色
             */}
              <View
                {...colorResponder.panHandlers}
                style={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: 100,
                  marginTop: 20,
                }}>
                <Button
                  onPress={() => {
                    setColorIndex(-1);
                    isCustom.current = true;
                    setBcolor(customColor);
                  }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    backgroundColor: customColor,
                    borderWidth: 2,
                    borderColor: isCustom.current ? 'white' : '#ab9b9b',
                  }}
                />
                <View style={{width: 30, height: 1}} />
                <View style={{width: '70%', justifyContent: 'center'}}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{width: colorBarWidth, height: 5}}
                    colors={['#ff0000', '#00ff00', '#0000ff', '#ff0000']}
                  />
                  <Animated.View
                    onLayout={e => {
                      setCustomColor(selectC(e.nativeEvent.layout.x));
                    }}
                    style={[
                      {
                        width: 10,
                        height: 10,
                        backgroundColor: 'white',
                        position: 'absolute',
                      },
                      {left: colordx},
                    ]}
                  />
                </View>

                <Input
                  defaultValue={customColor}
                  containerStyle={{width: 80, borderColor: 'transparent'}}
                  onChangeText={e => {
                    setCustomColor(e);
                  }}
                  iconSide="none"
                  textStyle={{color: 'white'}}
                />
              </View>
            </View>
          </View>
        ) : (
          rates.map(r => {
            let text;
            if (r === 1 || r === 2) {
              text = r + '.0';
            } else text = r + '';
            return (
              <Button
                onPress={() => {
                  setRate(r);
                }}
                style={{...styles.speedBtn}}>
                <Text
                  style={[
                    styles.speedT,
                    {color: rate === r ? basicColor : 'white'},
                  ]}>
                  {text}x&nbsp;
                </Text>
              </Button>
            );
          })
        )}
      </Animated.View>

      {showBs && (
        <BulletScreen
          videoId={videoId}
          now={progress}
          duration={duration}
          userId={userId || ''}
        />
      )}
      {/* 视频 */}
      <View
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          zIndex: 99,
        }}
        {...panResponder.panHandlers}
      />

      <View>
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
          style={{backgroundColor: 'black', width: '100%', height: '100%'}}
          source={{
            uri: videoUrl,
          }}
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
            durationF.current = Math.floor(e.duration);
            setIsLoading(false);
          }}
        />
      </View>

      {/* 底部条 */}
      <Animated.View style={[styles.footer, {bottom: inAnim}]}>
        <LinearGradient
          style={{...styles.linear}}
          colors={['transparent', barColor]}>
          {/* 暂停键 */}
          <Button
            onPress={() => {
              setPause(!pause);
              rPause.current = rPause.current;
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
          <View
            style={{
              flexGrow: 1,
              flexShrink: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Slider
              onChange={e => {
                myVideo.current?.seek(e);
                setProgress(e);
              }}
              style={{width: '80%'}}
              defaultValue={progress}
              minValue={0}
              maxValue={duration || 1}
              value={isDP ? undefined : progress}
              accessibilityLabel="hello world"
              step={1}>
              <Slider.Track
                onStartShouldSetResponder={a => {
                  setIsDP(true);
                  return true;
                }}
                onResponderRelease={a => {
                  setIsDP(false);
                }}>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb
                onStartShouldSetResponder={a => {
                  setIsDP(true);
                  return true;
                }}
                onResponderRelease={a => {
                  setIsDP(false);
                }}
              />
            </Slider>
          </View>
          <Text style={{color: 'white'}}>
            {getTime(progress)}/{getTime(duration)}&nbsp;&nbsp;&nbsp;
          </Text>
          <View />
          <View style={{width: 20, height: 20}} />
          {full ? (
            <>
              {/* 
                倍速
              */}
              <Button
                onPress={() => {
                  setIsBullet(false);
                  aCutIn();
                }}>
                <Text style={{color: 'white'}}>{setPoint(rate)}&nbsp;</Text>
              </Button>
              <View style={{width: 10, height: 1}} />
              {/* 
              弹幕
            */}
              <Switch
                defaultIsChecked={bss}
                onValueChange={e => {
                  setShowBs(e);
                  onShowChange && onShowChange(e);
                }}
              />
              <Button
                onPress={() => {
                  setIsBullet(true);
                  aCutIn();
                }}>
                <Bullet />
              </Button>
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
  speedBtn: {},
  speedT: {
    color: 'white',
  },
});

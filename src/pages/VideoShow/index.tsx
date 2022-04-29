import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import StatusBarSpace from '../../components/StatusBarSpace';
import VideoPlayer from '../../components/VideoPlayer';

import {Outlet, useLocation, useNavigate} from 'react-router-native';
import Button from '../../components/Button';
import getLoc from '../../utils/getLoc';
import {basicColor, bulletColors} from '../../static/color';
import {useAppSelector, useAppDispatch} from '../../store/hooks';

import uuid from 'uuid';
import Input from '../../components/Input';
import {Bullet, Send} from '../../static/myIcon';
import {getVideo} from '../../api';
import Share from '../../components/Share';
import LinearGradient from 'react-native-linear-gradient';
import {set} from '../../store/features/bulletScreenSlice';

const windowWidth = Dimensions.get('screen').width;

// 视频横纵比
const scale = 2.8 / 5;
// 选择器长度
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

export default function VideoShow() {
  const {state, pathname} = useLocation();
  const {videoURL, title, location, videoId} = state as any;
  const dispatch = useAppDispatch();
  const bullet = useAppSelector(s => s.bulletScreen);

  const [loc, setLoc] = useState(getLoc(pathname, 2));
  const navigation = useNavigate();

  const progress = useRef(0);
  useEffect(() => {
    setLoc(getLoc(pathname, 2));
  }, [pathname]);
  const user = useAppSelector(s => s.user);
  const myComment = useRef('');
  useEffect(() => {
    getVideo(videoId)
      .then(e => {
        console.log(e);
      })
      .catch(e => {
        console.log('videoshow error', e);
      });
  }, [videoId]);

  /* 
    弹幕内容
  */
  const bsContent = useRef('');

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
  // 颜色选择器展示判断
  const colorIsShow = useRef(false);
  // 选择器动画
  const cbHeight = useRef(new Animated.Value(0)).current;
  const cbCutIn = () => {
    Animated.timing(cbHeight, {
      duration: 300,
      useNativeDriver: false,
      toValue: 200,
    }).start();
    colorIsShow.current = true;
  };
  const cbCutOut = () => {
    Animated.timing(cbHeight, {
      duration: 300,
      useNativeDriver: false,
      toValue: 0,
    }).start();
    colorIsShow.current = false;
  };
  // 横向偏移量
  const dx = useRef(new Animated.Value(0)).current;
  // 累计位移
  const simulateX = useRef(0);
  // 颜色拖动
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (a, b) => {
        return true;
      },
      onMoveShouldSetPanResponder: (a, b) => {
        return true;
      },
      onPanResponderGrant: () => {},
      onPanResponderMove: (a, b) => {
        dx.setValue(
          Math.min(Math.max(b.dx + simulateX.current, 0), colorBarWidth),
        );
      },
      onPanResponderRelease: (a, b) => {
        simulateX.current = Math.min(
          Math.max(b.dx + simulateX.current, 0),
          colorBarWidth,
        );

        dx.flattenOffset();
      },
    }),
  ).current;

  useEffect(() => {
    isCustom.current && setBcolor(customColor);
  }, [customColor]);

  // 清空input
  const [clear, setClear] = useState<string | undefined>(undefined);

  return (
    <View style={styles.background}>
      <StatusBarSpace />

      {/* 
        颜色选择器
      */}
      <KeyboardAvoidingView
        style={[
          {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'black',
            zIndex: 9,
          },
        ]}
        behavior="padding">
        <Animated.View
          style={[
            {
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              overflow: 'hidden',
            },
            {height: cbHeight},
          ]}>
          <View style={{width: 20, height: 5}} />
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
                      borderColor: colorIndex === index ? 'white' : '#ab9b9b',
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
            {...panResponder.panHandlers}
            style={{
              flexDirection: 'row',
              width: '80%',
              alignItems: 'center',
              justifyContent: 'center',
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
                  {left: dx},
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
        </Animated.View>
      </KeyboardAvoidingView>

      <Share />

      {/* 视频播放 */}
      <VideoPlayer
        lastUrl={location}
        videoUrl={videoURL}
        title={title}
        style={{width: windowWidth, height: windowWidth * scale}}
        videoId={videoId}
        onProgress={e => {
          progress.current = e;
        }}
      />

      {
        <>
          {/* 编辑弹幕 */}
          <View
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              marginVertical: 5,
            }}>
            <Button
              style={{
                width: 40,
                height: 40,
                backgroundColor: bColor,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: '#ab9b9b',
              }}
              onPress={() => {
                colorIsShow.current ? cbCutOut() : cbCutIn();
              }}
            />

            <Input
              placeholderTextColor="white"
              placeholder="发一条弹幕吧~"
              textStyle={{color: 'white'}}
              iconSide={'right'}
              icon={<Bullet />}
              value={clear}
              onChangeText={e => {
                bsContent.current = e;
              }}
            />
            <Button
              onPress={() => {
                setClear('');
                setTimeout(() => {
                  setClear(undefined);
                }, 300);
                dispatch(
                  set({
                    duration: progress.current,
                    userId: user.userId || '',
                    content: bsContent.current,
                    color: bColor,
                    videoId: videoId,
                  }),
                );
              }}
              style={{
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: 'transparent',
                height: '90%',
                padding: 10,
              }}>
              <Text style={{color: 'white', fontSize: 20}}>发布</Text>
            </Button>
          </View>
          {/* 
            切换topbar
          */}
          <View style={[styles.changeBar]}>
            <Button
              style={{
                ...styles.changeBtn,
                borderColor: loc ? 'white' : basicColor,
              }}
              onPress={() => {
                loc && navigation('/video', {state});
              }}>
              <Text
                style={[styles.changeT, {color: loc ? 'white' : basicColor}]}>
                推荐
              </Text>
            </Button>
            <View style={[styles.space]} />
            <Button
              style={{
                ...styles.changeBtn,
                borderColor: loc === 'comment' ? basicColor : 'white',
              }}
              onPress={() => {
                navigation('/video/comment', {state});
              }}>
              <Text
                style={[
                  styles.changeT,
                  {color: loc === 'comment' ? basicColor : 'white'},
                ]}>
                评论
              </Text>
            </Button>
          </View>
          {/* 发表评论 */}
          {loc === 'comment' && (
            <View style={[styles.setC]}>
              {user.username !== '' ? (
                <Image
                  source={
                    user.avatar !== ''
                      ? {uri: user.avatar}
                      : require('../../static/img/defaultAvatar.png')
                  }
                  style={[styles.avatar]}
                />
              ) : (
                <Button
                  style={styles.avatar}
                  onPress={() => {
                    navigation('/startP/login');
                  }}>
                  <Text style={[styles.avatarT]}>登</Text>
                  <Text style={[styles.avatarT]}>录</Text>
                </Button>
              )}
              <Input
                onChangeText={e => {
                  myComment.current = e;
                }}
                unable={user.username === ''}
                placeholder={user.username === '' ? '请登录后发表评论' : ''}
                containerStyle={styles.input}
                iconSide="none"
              />
              <Button
                unable={user.username === ''}
                onPress={() => {
                  navigation('/video/comment', {
                    state: {
                      ...(state as any),
                      comment: {
                        username: user.username,
                        userId: user.userId,
                        commentId: uuid.v4(),
                        detail: myComment.current,
                        avatar: user.avatar,
                      },
                    },
                  });
                }}
                style={styles.subB}>
                <Send color={basicColor} />
              </Button>
            </View>
          )}
          {/* 视频列表/评论列表 */}
          <View style={styles.scrollView}>
            <Outlet />
          </View>
        </>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    height: '100%',
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  changeBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 2,
  },
  changeT: {
    color: 'white',
    fontSize: 20,
  },
  changeBtn: {
    backgroundColor: 'transparent',
    width: 80,
    borderBottomWidth: 2,
  },
  space: {
    width: 20,
    height: 2,
  },
  setC: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 50,
    flexWrap: 'wrap',
    flexGrow: 1,
    marginHorizontal: 8,
  },
  subB: {
    backgroundColor: 'transparent',
  },
  avatarT: {
    fontSize: 14,
    color: 'white',
  },
  csBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'white',
    padding: 3,
    width: 100,
  },
  csT: {
    color: 'white',
    fontSize: 20,
  },
});

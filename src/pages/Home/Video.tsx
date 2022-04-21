import {
  View,
  Text,
  PanResponder,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoPlayer from 'react-native-video';
import {getUser, getVideo, getVideoList} from '../../api';
import {videoType} from '../../static/types';
import {emptyVideo, videos as vs} from '../../config/video';
import Button from '../../components/Button';
import {FreePause, Like, Loading, Share, Star} from '../../static/myIcon';
import {Slider} from 'native-base';
import {emptyUser} from '../../config/user';
import {useNavigate} from 'react-router-native';

export default function Video() {
  const videoNum = useRef(0);
  const videos = useRef<Array<videoType>>(emptyVideo);
  const dragging = useRef<boolean>(false);
  const [video, setVideo] = useState<videoType>(emptyVideo[0]);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(1);

  const [author, setAuthor] = useState(emptyUser);

  // 暂停
  const [pause, setPause] = useState(false);
  // 加载
  const [loading, setLoading] = useState(false);
  // 隐藏侧边栏
  const hidden = useRef(false);

  const navigation = useNavigate();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (event, b) => {
        if (b.numberActiveTouches === 2) {
          hidden.current = !hidden.current;
        }

        return true;
      },
      onMoveShouldSetPanResponder: (a,b) => {
        if (Math.abs(b.dx) > 5 || Math.abs(b.dy) > 5) {
          return true;
        } else {
          return false;
        }
      },
      onPanResponderGrant: a => {},
      onPanResponderMove: (a, b) => {
        if (b.numberActiveTouches === 1) {
          if (b.dy > 10) {
            if (!dragging.current) {
              dragging.current = true;
              console.log(videos);

              if (videoNum.current === 0) {
                getVideoList(1)
                  .then(e => {
                    videos.current = [e.data.data[0], ...videos.current];
                    setVideo(videos.current[0]);
                    getUser(false, videos.current[videoNum.current].userId)
                      .then(e => {
                        setAuthor({...e.data.data});
                      })
                      .catch(e => {
                        console.log(e);
                      });
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
                getUser(false, videos.current[videoNum.current].userId)
                  .then(e => {
                    setAuthor({...e.data.data});
                    console.log(e);
                  })
                  .catch(e => {
                    console.log(e);
                  });
                videoNum.current -= 1;
              }
            }
          } else if (b.dy < -10) {
            if (!dragging.current) {
              dragging.current = true;
              if (videoNum.current >= videos.current.length - 1) {
                getVideoList(1)
                  .then(e => {
                    videos.current = [...videos.current, e.data.data[0]];
                    setVideo(videos.current[videoNum.current + 1]);
                    getUser(false, videos.current[videoNum.current].userId)
                      .then(e => {
                        setAuthor({...e.data.data});
                        console.log(e);
                      })
                      .catch(e => {
                        console.log(e);
                      });
                    videoNum.current += 1;
                  })
                  .catch(e => {
                    console.log('video getlist error', e);
                  });
              } else {
                setVideo(videos.current[videoNum.current + 1]);
                getUser(false, videos.current[videoNum.current].userId)
                  .then(e => {
                    setAuthor({...e.data.data});
                    console.log(e);
                  })
                  .catch(e => {
                    console.log(e);
                  });
                videoNum.current += 1;
              }
            }
          }
        }
      },
      onPanResponderRelease: (a, b) => {
        dragging.current = false;
      },
    }),
  ).current;

  useEffect(() => {
    getVideoList(1)
      .then(e => {
        setVideo(e.data.data[0]);
        videos.current = [e.data.data[0]];
        getUser(false, videos.current[videoNum.current].userId)
          .then(e => {
            setAuthor({...e.data.data});
          })
          .catch(e => {
            console.log(e);
          });
      })
      .catch(e => {
        console.log('video get 2nd list error', e);
      });
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {!hidden.current && (
        <View style={styles.right}>
          <Button
            style={styles.avatar}
            onPress={() => {
              navigation('/home/user', {state: {...author}});
            }}>
            <Image
              style={styles.avatar}
              source={
                author.avatar
                  ? {uri: author.avatar}
                  : require('../../static/img/defaultAvatar.png')
              }
            />
          </Button>
          <Button style={styles.rightBtn}>
            <Like />
            <Text style={styles.rightT}>{video.like || 0}</Text>
          </Button>
          <Button style={styles.rightBtn}>
            <Star size={9} />
            <Text style={styles.rightT}>{video.star || 0}</Text>
          </Button>
          <Button style={styles.rightBtn}>
            <Share size={9} />
            <Text style={styles.rightT}>{video.share || 0}</Text>
          </Button>
        </View>
      )}
      {!hidden.current && (
        <View style={styles.detail}>
          <Text style={styles.detailT}>{video.title}</Text>
          <Text style={styles.detailT}>{video.description}</Text>
        </View>
      )}
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
  right: {
    position: 'absolute',
    right: 0,
    top: '54%',
    borderRadius: 5,
    padding: 6,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 300,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  rightBtn: {
    backgroundColor: 'transparent',
  },
  rightT: {
    color: 'white',
  },
  detail: {
    width: 200,
    height: 200,
    backgroundColor: '#00000050',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 99,
    borderTopRightRadius: 5,
  },
  detailT: {
    color: 'white',
  },
});

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import StatusBarSpace from '../../components/StatusBarSpace';
import VideoPlayer from '../../components/VideoPlayer';

import {Outlet, useLocation, useNavigate} from 'react-router-native';
import Button from '../../components/Button';
import getLoc from '../../utils/getLoc';
import {basicColor} from '../../static/color';

const windowWidth = Dimensions.get('screen').width;

// 视频横纵比
const scale = 2.8 / 5;

export default function VideoShow() {
  const {state, pathname} = useLocation();
  const {videoURL, title, location} = state as any;

  const [loc, setLoc] = useState(getLoc(pathname, 2));
  const navigation = useNavigate();
  useEffect(() => {
    setLoc(getLoc(pathname, 2));
  }, [pathname]);
  return (
    <View style={styles.background}>
      <StatusBarSpace />
      <VideoPlayer
        lastUrl={location}
        videoUrl={videoURL}
        title={title}
        style={{width: windowWidth, height: windowWidth * scale}}
      />
      <View style={[styles.changeBar]}>
        <Button
          style={{
            ...styles.changeBtn,
            borderColor: loc ? 'white' : basicColor,
          }}
          onPress={() => {
            loc && navigation('/video', {state});
          }}>
          <Text style={[styles.changeT, {color: loc ? 'white' : basicColor}]}>
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
      <ScrollView alwaysBounceVertical={false} style={styles.scrollView}>
        <Outlet />
      </ScrollView>
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
});

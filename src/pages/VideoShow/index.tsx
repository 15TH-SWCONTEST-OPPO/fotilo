import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import React from 'react';
import StatusBarSpace from '../../components/StatusBarSpace';
import VideoPlayer from '../../components/VideoPlayer';

import {useLocation} from 'react-router-native';

const windowWidth = Dimensions.get('screen').width;

// 视频横纵比
const scale = 2.8 / 5;

export default function VideoShow() {
  const {state} = useLocation();
  const {videoURL, title, avatar, username, likeNum, videoNum} = state as any;

  return (
    <View style={styles.background}>
      <StatusBarSpace />
      <VideoPlayer
        videoUrl={videoURL}
        title={title}
        style={{width: windowWidth, height: windowWidth * scale}}
      />
      <ScrollView alwaysBounceVertical={false} style={styles.scrollView}>

        <View style={[styles.userC]}>
          <Image style={[styles.avatar]} source={{uri: avatar}} />
          <View style={[styles.space]}/>
          <View>
            <Text style={[styles.username]}>{username}&nbsp;</Text>
            <Text style={[styles.userdetail]}>
              视频数：{videoNum || 0}&nbsp;|&nbsp;获赞数：{likeNum || 0}
            </Text>
          </View>
        </View>



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
  text: {
    fontSize: 42,
    height: 2000,
  },
  userC: {
    width: 180,
    flexDirection: 'row',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  username: {
    color: 'white',
    fontSize: 20,
  },
  userdetail: {
    color: 'white',
  },
  space: {
    width: 10,
    height: 10,
  },
});

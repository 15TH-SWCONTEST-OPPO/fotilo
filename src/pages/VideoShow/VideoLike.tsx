import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {useLocation} from 'react-router-native';

export default function VideoLike() {
  const {state} = useLocation();

  const {avatar, username, videoNum, likeNum,location} = state as any;
  return (
    <View>
      <View style={[styles.userC]}>
        <Image style={[styles.avatar]} source={{uri: avatar}} />
        <View style={[styles.space]} />
        <View>
          <Text style={[styles.username]}>{username}&nbsp;</Text>
          <Text style={[styles.userdetail]}>
            视频数：{videoNum || 0}&nbsp;|&nbsp;获赞数：{likeNum || 0}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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

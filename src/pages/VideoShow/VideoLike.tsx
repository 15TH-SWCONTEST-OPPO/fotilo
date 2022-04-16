import {View, Text, Image, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useLocation} from 'react-router-native';
import Button from '../../components/Button';
import {Like, Share, Star} from '../../static/myIcon';
import {videos} from '../../config/video';
import VideoCardL from '../../components/VideoCardL';
import {basicColor} from '../../static/color';

export default function VideoLike() {
  const {state} = useLocation();

  const {
    avatar,
    username,
    videoNum,
    likeNum,
    title,
    description,
    star,
    like,
    share,
    location,
    videoId
  } = state as any;

  const t = useRef([like || 0, star || 0, share || 0]);

  const [three, setThree] = useState<[number, number, number]>([
    t.current[0],
    t.current[1],
    t.current[2],
  ]);
  useEffect(() => {
      t.current = [like || 0, star || 0, share || 0];
      setThree([like || 0, star || 0, share || 0]);
  }, [videoId]);
  return (
    <View style={[styles.container]}>
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

      <View style={[styles.detail]}>
        <Text style={[styles.title]}>{title}</Text>
        <Text style={[styles.description]}>{description}</Text>
      </View>

      <View style={[styles.three]}>
        <Button
          style={styles.threeBtn}
          onPress={() => {
            setThree([three[0] === t.current[0] ? t.current[0] + 1 : t.current[0], three[1], three[2]]);
          }}>
          <Like size={6} color={three[0] !== t.current[0] ? basicColor : 'white'} />
          <Text
            style={[
              styles.threeT,
              ,
              {color: three[0] !== t.current[0] ? basicColor : 'white'},
            ]}>
            {three[0]}&nbsp;
          </Text>
        </Button>
        <Button
          style={styles.threeBtn}
          onPress={() => {
            setThree([three[0], three[1] === t.current[1] ? t.current[1] + 1 : t.current[1], three[2]]);
          }}>
          <Star color={three[1] !== t.current[1] ? basicColor : 'white'} />
          <Text
            style={[
              styles.threeT,
              {color: three[1] !== t.current[1] ? basicColor : 'white'},
            ]}>
            {three[1]}&nbsp;
          </Text>
        </Button>
        <Button
          style={styles.threeBtn}
          onPress={() => {
            setThree([three[0], three[1], three[2] + 1]);
          }}>
          <Share />
          <Text style={[styles.threeT]}>{three[2]}&nbsp;</Text>
        </Button>
      </View>

      <View style={{width: '100%'}}>
        {videos.map(v => {
          return <VideoCardL location={location} {...v} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  userC: {
    width: '100%',
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
  detail: {
    width: '100%',
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginTop: 10,
  },
  description: {
    color: 'white',
    fontSize: 10,
  },
  three: {
    flexDirection: 'row',
    width: 400,
    paddingVertical: 20,
    justifyContent: 'space-evenly',
  },
  threeBtn: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  threeT: {
    color: 'white',
    marginHorizontal: 5,
  },
});

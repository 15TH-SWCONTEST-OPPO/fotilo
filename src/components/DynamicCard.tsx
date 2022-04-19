import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUser} from '../api';
import {emptyUser} from '../config/user';
import Button from './Button';
import {useNavigate} from 'react-router-native';
import {Comment, Like, Share, Star} from '../static/myIcon';
import VideoMid from './VideoMid';
import {videoType} from '../static/types';

export type basicDynamic = {
  userId: string;
  content: string;
  likes?: number;
  comments?: number;
  images: Array<string>;
  videoInfo: videoType;
};
export default function DynamicCard(props: basicDynamic) {
  const {userId, content, likes, comments, videoInfo, images} = props;
  
  const [auth, setAuth] = useState(emptyUser);
  const navigation = useNavigate();
  useEffect(() => {
    getUser(false, userId)
      .then(user => {
        setAuth(user.data.data);
      })
      .catch(e => {
        console.log('dynamicCreate Error',e);
      });
  }, []);

  return (
    <View style={styles.container}>
      <Button
        style={styles.authButton}
        onPress={() => {
          navigation('/home/user', {state: {...auth}});
        }}>
        <Image
          style={styles.authAvatar}
          source={
            auth.avatar
              ? {uri: auth.avatar}
              : require('../static/img/defaultAvatar.png')
          }
        />
        <Text style={styles.authName}>
          &nbsp;{auth.username || '123'}&nbsp;&nbsp;&nbsp;&nbsp;
        </Text>
      </Button>
      <View style={{width: 10, height: 2}} />
      <Text style={styles.detail}>{content || '真好啊'}</Text>

      <View style={{width: '100%',marginBottom:20}}>
        {videoInfo && <VideoMid video={videoInfo} userId={userId} />}
      </View>

      <View style={styles.three}>
        <Button style={styles.threeBtn}>
          <Comment size={5} />
          <Text style={styles.threeT}>&nbsp;{comments || 0}&nbsp;&nbsp;</Text>
        </Button>
        <Button style={styles.threeBtn}>
          <Like size={5} />
          <Text style={styles.threeT}>&nbsp;{likes || 0}&nbsp;&nbsp;</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    alignItems: 'flex-start',
    borderWidth: 2,
    borderColor: '#3a3838',
    padding: 5,
  },
  authAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  authButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  authName: {
    fontSize: 20,
    color: 'white',
  },
  detail: {
    color: 'white',
    fontSize: 20,
  },
  three: {
    width: '100%',
    flexDirection: 'row-reverse',
  },
  threeBtn: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
  },
  threeT: {
    color: 'white',
  },
});

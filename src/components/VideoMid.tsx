import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUser, getVideo} from '../api';
import {emptyUser} from '../config/user';
import {emptyVideo} from '../config/video';
import Button from './Button';
import {useNavigate} from 'react-router-native';
import {basicColor} from '../static/color';
import { videoType } from '../static/types';

export default function VideoMid(props: {video: videoType; userId: string}) {
  const [user, setUser] = useState(emptyUser);
  const navigation = useNavigate();
  const {video, userId} = props;
  
    

  useEffect(() => {
    getUser(false, userId)
      .then(user => {
        setUser(user.data.data);
      })
      .catch(error => {
        console.log(error);
      });
    
  }, []);
  return (
    <View style={[styles.container]}>
      <Button
        style={styles.avatarBtn}
        onPress={() => {
          navigation('/home/user', {state: {...user}});
        }}>
        <Text style={styles.avatarT}>@{user.username}&nbsp;</Text>
      </Button>
      <Text style={styles.description}>{video.description}</Text>
      <Button
        style={styles.cover}
        onPress={() => {
          navigation('/video', {state: {...video,...user,location:'/home/dynamic'}});
        }}>
        <Image source={{uri: video.coverURL}} style={styles.cover} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dddddd29',
    padding: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'flex-start',
  },
  cover: {
    height: 200,
    borderRadius: 5,
    width: '100%',
    backgroundColor: 'white',
  },
  avatarBtn: {
    backgroundColor: 'transparent',
  },
  avatarT: {
    color: basicColor,
  },
  description: {
    color: 'white',
  },
});

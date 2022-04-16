import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useRef} from 'react';
import {videoType} from '../static/types';
import getTime from '../utils/getTime';
import getUser from '../config/getUser';
import Button from './Button';
import {Comment, Like, Share} from '../static/myIcon';
import {useLocation, useNavigate} from 'react-router-native';

interface VideoProps extends videoType {}

export default function VideoCardB(props: VideoProps) {
  const {
    title,
    videoId,
    videoURL,
    coverURL,
    userID: userId,
    description,
    duration,
    like,
    share,
    comment,
  } = props;

  const {username, avatar, ...user} = useRef(getUser(userId)).current;

  const navigation = useNavigate();
  const location = useLocation();

  return (
    <View style={{...styles.showP}}>
      <Button
        onPress={() => {
          navigation('/video', {
            state: {
              ...user,
              ...props,
              username,
              avatar,
              location: location.pathname,
            },
          });
        }}>
        <Text style={[styles.vDuration]}>{getTime(duration)}&nbsp;</Text>
        <Image style={[styles.cover]} source={{uri: coverURL}} />
      </Button>
      <View style={[styles.bottom]}>
        <Button
          style={{backgroundColor: 'transparent', flexDirection: 'row'}}
          onPress={() => {
            navigation('/home/user', {state: {...user, username, avatar}});
          }}>
          <Image style={[styles.avatar]} source={{uri: avatar}} />
          <Text style={[styles.username]}>&nbsp;{username}&nbsp;</Text>
        </Button>
        <View>
          <Text style={[styles.title]}>{title}</Text>
          <View style={[styles.threeBtn]}>
            <View style={[styles.btn]}>
              <Like size={6} />
              <Text style={[styles.threeT]}>{like || 0}</Text>
            </View>
            <View style={[styles.btn]}>
              <Comment size={6} />
              <Text style={[styles.threeT]}>{comment || 0}</Text>
            </View>
            <View style={[styles.btn]}>
              <Share size={7} />
              <Text style={[styles.threeT]}>{share || 0}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  showP: {
    width: '100%',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: 'black',
    marginBottom: 10,
  },
  cover: {
    width: '100%',
    height: 200,
    backgroundColor: 'black',
  },
  vDuration: {
    borderRadius: 5,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: 'black',
    color: 'white',
    position: 'absolute',
    zIndex: 999,
    opacity: 0.5,
    bottom: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 35,
    overflow: 'hidden',
  },
  bottom: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  username: {
    color: 'white',
    fontSize: 20,
    width: 100,
  },
  threeBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  threeT: {
    color: 'white',
    fontSize: 18,
  },
  btn: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-evenly',
  },
});

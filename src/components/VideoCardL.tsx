import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {videoType} from '../static/types';
import getTime from '../utils/getTime';
import {getUser} from '../api';
import Button from './Button';
import {Up} from '../static/myIcon';
import {useNavigate} from 'react-router-native';
import {defaultColor} from '../static/color';
import {emptyUser} from '../config/user';

interface VideoProps extends videoType {
  location: string;
}

export default function VideoCardL(props: VideoProps) {
  const {
    title,
    coverURL,
    userId,
    description,
    duration,
    location,
    watch,
  } = props;

  const [user, setUser] = useState(emptyUser);
  useEffect(() => {
    getUser(userId).then((e:any) =>{
      setUser(e.data.data)
    })
  },[])

  const navigation = useNavigate();

  return (
    <Button
      style={{backgroundColor: 'transparent'}}
      onPress={() => {
        navigation('/video', {
          state: {
            ...user,
            description: '',
            ...props,
            location: location,
          },
        });
      }}>
      <View style={{...styles.showP}}>
        <View>
          <Text style={[styles.vDuration]}>{getTime(duration)}&nbsp;</Text>
          <Image style={[styles.cover]} source={{uri: coverURL}} />
        </View>

        <View style={[styles.right]}>
          <Text style={[styles.title]}>{title}</Text>
          <Text style={[styles.description]}>{description}</Text>
          <View style={styles.up}>
            <Up size={4} />
            <Text style={[styles.upT]}>&nbsp;{user.username}&nbsp;</Text>
          </View>
          <Text style={[styles.upT]}>{watch || 0}次观看</Text>
        </View>
      </View>
    </Button>
  );
}

const styles = StyleSheet.create({
  showP: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'black',
    marginBottom: 10,
    flexDirection: 'row',
  },
  cover: {
    borderRadius: 5,
    width: 160,
    height: 80,
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
  },
  description: {
    color: defaultColor,
  },
  right: {
    marginLeft: 5,
    justifyContent: 'space-between',
  },
  up: {
    flexDirection: 'row',
  },
  upT: {
    color: 'white',
    fontSize: 10,
  },
});

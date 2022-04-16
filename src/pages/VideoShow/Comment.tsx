import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {basicColor, defaultColor} from '../../static/color';

import {comments} from '../../config/comments';
import { useLocation } from 'react-router-native';

export default function Comment() {
  const {state}=useLocation()
  const [cs, setCs] = useState(comments);
  useEffect(() => {
    const {comment}=state as any;
    comment&&setCs([comment,...cs])
  },[state])
  return (
    <View style={[styles.container]}>
      <View>
        {cs.map(c => {
          return (
            <View style={[styles.comment]} key={c.commentId}>
              <View style={[styles.cAvatarC]}>
                <Image
                  style={[styles.cAvatar]}
                  source={
                    c.avatar
                      ? {uri: c.avatar}
                      : require('../../static/img/defaultAvatar.png')
                  }
                />
                <Text style={[styles.cAvatarT]}>
                  &nbsp;&nbsp;{c.username}&nbsp;&nbsp;
                </Text>
              </View>
              <Text style={[styles.detail]}>{c.detail}&nbsp;&nbsp;</Text>
              <View style={[styles.bottom]} />
            </View>
          );
        })}
        <View style={[styles.space]}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    height:'100%'
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
  comments: {
    padding: 5,
  },
  comment: {
    alignItems: 'center',
  },
  bottom: {
    width: '90%',
    height: 3,
    borderBottomWidth: 1,
    borderBottomColor: defaultColor,
    opacity: 0.8,
  },
  cAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  cAvatarC: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cAvatarT: {
    color: 'white',
    fontSize: 15,
  },
  detail: {
    width: '90%',
    color: 'white',
  },
  space:{
    height:20,
    width:10
  }
});

import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {basicColor, defaultColor} from '../../static/color';

import {comments} from '../../config/comments';
import {useLocation, useNavigate} from 'react-router-native';
import {Like, Trash} from '../../static/myIcon';
import Button from '../../components/Button';
import {useAppSelector} from '../../store/hooks';

export default function Comment() {
  const {state} = useLocation();
  const [cs, setCs] = useState(comments);
  const navigation=useNavigate();
  const user = useAppSelector(s => s.user);
  const{userID}=state as any
  useEffect(() => {
    const {comment} = state as any;
    comment && setCs([comment, ...cs]);
  }, [state]);
  return (
    <View style={[styles.container]}>
      <View>
        {cs.map(c => {
          return (
            <View style={[styles.comment]} key={c.commentId}>
              <Button onPress={()=>{
                navigation('/home/user',{state:{userID:c.userID}})
              }} style={styles.cAvatarC}>
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
              </Button>
              <Text style={[styles.detail]}>{c.detail}&nbsp;&nbsp;</Text>

              {c.userID === user.userID && (
                <Button
                  onPress={() => {
                    setCs(cs.filter(e => e.commentId !== c.commentId));
                  }}
                  style={styles.bottomBtn}>
                  <Trash size={4} />
                  <Text style={[styles.bottomT]}>删除&nbsp;&nbsp;</Text>
                </Button>
              )}
              <View style={[styles.bottom]} />
            </View>
          );
        })}
        <View style={[styles.space]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
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
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
  },
  cAvatarT: {
    color: 'white',
    fontSize: 15,
  },
  detail: {
    width: '90%',
    color: 'white',
  },
  space: {
    height: 20,
    width: 10,
  },
  bottomBtn: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    backgroundColor: 'transparent',
  },
  bottomT: {
    color: 'white',
  },
});

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {useAppSelector} from '../../store/hooks';
import Button from '../../components/Button';
import {useNavigate} from 'react-router-native';
import {useAppDispatch} from '../../store/hooks';
import {set} from '../../store/features/imgCSlice';

const AvatarSize = 160;

export default function Me() {
  const navigation = useNavigate();

  const {username, avatar, intr, videoNum, likeNum} = useAppSelector(
    store => store.user,
  );
  const [img, setImg] = useState<any>(
    avatar ? {uri: avatar} : require('../../static/img/defaultAvatar.png'),
  );

  const dispatch = useAppDispatch();

  // 头像选择
  const chooseAvatar = () => {
    dispatch(set({iniPic: img, show: true, scale: 1}));
  };

  return (
    <>
      <ImageBackground
        style={{...styles.background}}
        source={require('../../static/img/Ubackground.png')}
      />
      <View style={{...styles.backgroundSpace}} />

      <View style={{...styles.avatarC}}>
        <View style={{...styles.avatarAround}}>
          <Text style={{...styles.aroundT}}>视频数</Text>
          <Text style={{...styles.aroundT}}>{videoNum || 0}</Text>
        </View>

        {username ? (
          <Button style={{...styles.avatar}} onPress={chooseAvatar}>
            <Image style={{...styles.avatar}} source={img} />
          </Button>
        ) : (
          <Button
            style={{...styles.avatar}}
            onPress={() => {
              navigation('../../StartP/login');
            }}>
            <Text style={{...styles.avatarT}}>登</Text>
            <Text style={{...styles.avatarT}}>录</Text>
          </Button>
        )}

        <View style={{...styles.avatarAround}}>
          <Text style={{...styles.aroundT}}>获赞数</Text>
          <Text style={{...styles.aroundT}}>{likeNum || 0}</Text>
        </View>
      </View>
      <View style={{...styles.userN}}>
        <Text style={{...styles.userNT}}>{username || '用户未登录'}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  avatarC: {
    height: AvatarSize,
    width: '100%',
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  avatar: {
    width: AvatarSize,
    height: AvatarSize,
    borderRadius: AvatarSize / 2,
  },
  background: {
    height: 200 + AvatarSize / 2,
    width: '100%',
    position: 'absolute',
  },
  backgroundSpace: {
    height: 200,
  },
  avatarAround: {
    alignItems: 'center',
  },
  aroundT: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'ABeeZee',
  },
  userN: {
    width: '100%',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userNT: {
    color: 'white',
    fontSize: 30,
  },
  avatarT: {
    fontSize: 40,
    color: 'white',
  },
});

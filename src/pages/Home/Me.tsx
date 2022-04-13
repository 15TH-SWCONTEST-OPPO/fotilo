import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import React from 'react';

import {useAppSelector} from '../../store/hooks';
import Button from '../../components/Button';

const AvatarSize = 160;

export default function Me() {
  const {username, avatar, intr,videoNum,likeNum} = useAppSelector(store => store.user);

  return (
    <ScrollView>
      <ImageBackground
        style={{...styles.background}}
        source={require('../../static/img/Ubackground.png')}
      />
      <View style={{...styles.backgroundSpace}} />
      <View style={{...styles.avatarC}}>

        <View style={{...styles.avatarAround}}>
          <Text style={{...styles.aroundT}}>
            视频数 
          </Text>
          <Text style={{...styles.aroundT}}>
            {videoNum||0}
          </Text>
        </View>

        <Button style={{...styles.avatar}}>
          <Image
            style={{...styles.avatar}}
            source={
              avatar
                ? {uri: avatar}
                : require('../../static/img/defaultAvatar.png')
            }
          />
        </Button>

        <View style={{...styles.avatarAround}}>
          <Text style={{...styles.aroundT}}>
            获赞数 
          </Text>
          <Text style={{...styles.aroundT}}>
            {likeNum||0}
          </Text>
        </View>

      </View>
    </ScrollView>
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
    backgroundColor: 'white',
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
  aroundT:{
    color:'white',
    fontSize:20,
    fontFamily: 'ABeeZee'
  }
});

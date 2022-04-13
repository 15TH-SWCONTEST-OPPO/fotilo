import {View, Text, StyleSheet, ImageBackground} from 'react-native';
import React from 'react';
import {basicColor} from '../static/color';
import Button from './Button';
import Input from './Input';
import {Camera, Message, SearchBtn} from '../static/myIcon';
import {useAppSelector} from '../store/hooks';
import {useNavigate} from 'react-router-native';

export default function TopBar() {
  const user = useAppSelector(store => store.user);
  const navigation = useNavigate();

  return (
    <View style={{...styles.container}}>
      <>
        {user.userID ? (
          <Button style={{...styles.avatar}}>
            <ImageBackground style={{...styles.avatar}} source={user.avatar?{uri:user.avatar}:require('../static/img/defaultAvatar.png')} />
          </Button>
        ) : (
          <Button
            style={{...styles.avatar}}
            onPress={() => {
              navigation('../StartP/login');
            }}>
            <Text style={{...styles.avatarT}}>登</Text>
            <Text style={{...styles.avatarT}}>录</Text>
          </Button>
        )}
      </>
      <Input
        placeholder="搜索一下"
        placeholderTextColor="#c0c0c0"
        iconSide="right"
        icon={
          <Button style={{...styles.SearchBtn}}>
            <SearchBtn size={5} />
          </Button>
        }
        containerStyle={{...styles.input}}
      />
      <Button style={{...styles.iconBtn}}>
        <Camera />
      </Button>
      <Button style={{...styles.iconBtn}}>
        <Message />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarT: {
    color: basicColor,
  },
  input: {
    height: 40,
    backgroundColor: '#3b3b3b',
    borderRadius: 20,
    borderWidth: 0,
  },
  SearchBtn: {
    backgroundColor: 'transparent',
  },
  iconBtn: {
    backgroundColor: 'transparent',
  },
});

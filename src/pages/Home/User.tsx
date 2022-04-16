import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {useAppSelector} from '../../store/hooks';
import Button from '../../components/Button';
import {useLocation, useNavigate} from 'react-router-native';
import {useAppDispatch} from '../../store/hooks';
import {set} from '../../store/features/imgCSlice';
import Input from '../../components/Input';
import {defaultColor} from '../../static/color';
import getUser from '../../config/getUser';

const AvatarSize = 160;

export default function User() {
  const navigation = useNavigate();

  const {state} = useLocation();
  const {userID: uID} = state as any;

  const {
    username: uName,
    likeNum: uLikeNum,
    videoNum: uVideoNum,
    avatar: uAvatar,
    description,
  } = getUser(uID);

  const {userID} = useAppSelector(store => store.user);

  const [img, setImg] = useState<any>(
    uAvatar ? {uri: uAvatar} : require('../../static/img/defaultAvatar.png'),
  );
  // username 修改
  const [name, setName] = useState<string>(uName);
  const [cName, setCName] = useState<boolean>(false);
  const nowName = useRef(uName);
  // description 修改
  const [des, setDes] = useState<string>(description || '');
  const [cDes, setCDes] = useState<boolean>(false);
  const nowDes = useRef(description);

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
          <Text style={{...styles.aroundT}}>视频数&nbsp;&nbsp;</Text>
          <Text style={{...styles.aroundT}}>{uVideoNum || 0}&nbsp;&nbsp;</Text>
        </View>

        {userID !== uID ? (
          <Button
            style={{...styles.avatar}}
            onPress={() => {
              console.log(state, uID, userID);
              userID === uID && chooseAvatar();
            }}>
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
          <Text style={{...styles.aroundT}}>获赞数&nbsp;&nbsp;</Text>
          <Text style={{...styles.aroundT}}>{uLikeNum || 0}&nbsp;&nbsp;</Text>
        </View>
      </View>
      <View style={{...styles.userN}}>
        <Button
          style={styles.userNTB}
          onPress={() => {
            if (uID === userID) {
              setCName(true);
            }
          }}>
          {cName ? (
            <Input
              textStyle={styles.cnameT}
              iconSide="none"
              onChangeText={e => {
                nowName.current = e || nowName.current;
              }}
              onBlur={() => {
                setName(nowName.current);
                setCName(false);
              }}
              defaultValue={name}
            />
          ) : (
            <Text style={{...styles.userNT}}>
              {name || '用户未登录'}&nbsp;&nbsp;
            </Text>
          )}
        </Button>
        <Button
          style={styles.userNTB}
          onPress={() => {
            if (uID === userID) {
              setCDes(true);
            }
          }}>
          {cDes ? (
            <Input
              textStyle={styles.cnameT}
              iconSide="none"
              onChangeText={e => {
                nowDes.current = e;
              }}
              onBlur={() => {
                setDes(nowDes.current || '');
                setCDes(false);
              }}
              defaultValue={des}
            />
          ) : (
            <Text style={{...styles.desNT}}>
              {des || '该用户目前还没有介绍~'}&nbsp;&nbsp;
            </Text>
          )}
        </Button>
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
  desNT: {
    color: defaultColor,
  },
  avatarT: {
    fontSize: 40,
    color: 'white',
  },
  userNTB: {
    backgroundColor: 'transparent',
  },
  cnameT: {
    color: 'white',
  },
});

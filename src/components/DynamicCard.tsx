import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getUser} from '../api';
import {emptyUser} from '../config/user';
import Button from './Button';
import {useNavigate} from 'react-router-native';
import {Comment, Like, Share, Star} from '../static/myIcon';
import VideoMid from './VideoMid';
import {videoType} from '../static/types';
import uuid from 'uuid';
import {useAppDispatch} from '../store/hooks'
import {setShow,setImgs,setIndex} from '../store/features/imgChooseSlice';

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
  const [width, setWidth] = useState(0);

  const dispatch = useAppDispatch();
  const navigation = useNavigate();
  useEffect(() => {
    getUser(false, userId)
      .then(user => {
        setAuth(user.data.data);
      })
      .catch(e => {
        console.log('dynamicCreate Error', e);
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
      <Text style={styles.detail}>{content}</Text>

      <View
        onLayout={e => {
          images.length > 0 &&
            setWidth(
              e.nativeEvent.layout.width *
                (Math.ceil((images.length >= 9 ? 9 : images.length) / 3) / 3),
            );
        }}
        style={[
          {
            width: '100%',
            marginBottom: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
          },
          width != 0 && {height: width},
        ]}>
        {images.length > 0
          ? images.map((i, index) => {
              if (index > 8) return;
              return (
                <Button
                  key={uuid.v4()}
                  style={{
                    height:
                      (4 -
                        Math.ceil(
                          (images.length >= 9 ? 9 : images.length) / 3,
                        )) *
                        33 +
                      '%',
                    width: '33%',
                    backgroundColor: 'transparent',
                  }}
                  onPress={() => {
                    dispatch(setIndex(index))
                    dispatch(setImgs(images));
                    dispatch(setShow(true));
                  }}>
                  {index === 8 && (
                    <View
                      style={{
                        position: 'absolute',
                        backgroundColor: '#000000c0',
                        width: '100%',
                        height: '100%',
                        zIndex: 99,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{color: 'white', fontSize: 40}}>
                        +{images.length - 9}
                      </Text>
                    </View>
                  )}
                  <Image
                    style={[{height: '100%', width: '100%'}]}
                    source={{uri: i}}
                  />
                </Button>
              );
            })
          : videoInfo && <VideoMid video={videoInfo} userId={userId} />}
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
    padding: 8,
    width:'100%'
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
  images: {
    width: '33%',
  },
});

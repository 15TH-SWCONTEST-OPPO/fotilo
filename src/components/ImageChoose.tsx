import {
  View,
  ViewProps,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Text,
  PermissionsAndroid,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {useAppSelector, useAppDispatch} from '../store/hooks';
import {set} from '../store/features/imgCSlice';
import {set as setUser} from '../store/features/userSlice';
import Button from './Button';
import StatusSpace from './StatusBarSpace';
import {ArrowBackIcon} from 'native-base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {finishUpload, uploadAvatar, uploadImg} from '../api';
import {
  AliyunVodFileUpload,
  AliyunVodFileUploadEmitter,
} from '../utils/aliyun-vod-payload';
import { useNavigate } from 'react-router-native';

interface ImageChooseProps extends ViewProps {}

const windowWidth = Dimensions.get('screen').width;
const windowHeight = Dimensions.get('screen').height;

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
};

export default function ImageChoose(props: ImageChooseProps) {
  const {style} = props;

  const imageId = useRef('');
  const {show, iniPic, scale} = useAppSelector(store => store.imgC);
  const user = useAppSelector(s => s.user);
  const {userId} = user;

  const navigation=useNavigate()

  const dispatch = useAppDispatch();

  useEffect(() => {
   const s= AliyunVodFileUploadEmitter.addListener(
      'OnUploadProgress',
      (result: any) => {
        if (result.progress === 1&&show) {
          finishUpload(imageId.current).then(()=>{
            uploadAvatar({userId: userId || '', imageId: imageId.current})
              .then(e => {
                console.log(e);
                dispatch(setUser({...user, avatar: e.data.data.avatar}));
                dispatch(set({show: false}));
                navigation('/startP');

              })
              .catch(e => {
                console.log(e);
              });
          })
        }
      },
    );
    return ()=>{
      s.remove()
    }
  }, []);

  return (
    <View style={[styles.container, style, {display: show ? 'flex' : 'none'}]}>
      <View style={[styles.top]}>
        <StatusSpace />
        <TouchableHighlight
          underlayColor="transparent"
          style={{width: 30}}
          onPress={() => {
            dispatch(set({show: false}));
          }}>
          <ArrowBackIcon style={styles.backArrow} />
        </TouchableHighlight>
      </View>
      <ImageBackground
        style={[{...styles.pic}, {height: windowWidth * scale}]}
        source={iniPic}
      />
      <View style={[styles.bottomContainer]}>
        <Button
          style={{...styles.btn}}
          onPress={() => {
            launchImageLibrary({mediaType: 'photo'}, e => {
              if (e.assets) {
                const title = userId + '-avatar';
                const imageExt: 'png' | 'jpg' | 'jpeg' | 'gif' =
                  e.assets[0].type!.split(/\//)[1] as any;
                  dispatch(setUser({avatar: e.assets[0].uri}));
                uploadImg({
                  title,
                  imageType: 'DEFAULT',
                  imageExt,
                }).then(res => {
                  imageId.current = res.data.data.imageId;
                  AliyunVodFileUpload.init(
                    {
                      videoId: res.data.data.imageId,
                      uploadAuth: res.data.data.uploadAuth,
                      uploadAddress: res.data.data.uploadAddress,
                    },
                    res => {
                      console.log(res);
                    },
                  );
                  AliyunVodFileUpload.addFile({
                    path: e.assets![0].uri!.split(/^file:\/\//)[1],
                    type: e.assets![0].type || '',
                    title,
                    desc: '',
                    tags: '',
                    cateId: 1,
                  });
                  AliyunVodFileUpload.start();
                });
              }
            });
          }}>
          <Text style={[styles.btnT]}>从相册选择图片</Text>
        </Button>
        <Button
          style={{...styles.btn}}
          onPress={() => {
            requestCameraPermission().then(() => {
              launchCamera({mediaType: 'photo', saveToPhotos: true}, e => {
                if (e.assets) {
                  dispatch(set({show: false}));
                  dispatch(setUser({avatar: e.assets[0].uri}));
                  const title = userId + '-avatar';
                  const imageExt: 'png' | 'jpg' | 'jpeg' | 'gif' =
                    e.assets[0].type!.split(/\//)[1] as any;
                  uploadImg({
                    title,
                    imageType: 'DEFAULT',
                    imageExt,
                  }).then(res => {
                    imageId.current = res.data.data.imageId;
                    AliyunVodFileUpload.init(
                      {
                        videoId: res.data.data.imageId,
                        uploadAuth: res.data.data.uploadAuth,
                        uploadAddress: res.data.data.uploadAddress,
                      },
                      res => {
                        console.log(res);
                      },
                    );
                    AliyunVodFileUpload.addFile({
                      path: e.assets![0].uri!.split(/^file:\/\//)[1],
                      type: e.assets![0].type || '',
                      title,
                      desc: '',
                      tags: '',
                      cateId: 1,
                    });
                    AliyunVodFileUpload.start();
                  });
                }
              });
            });
          }}>
          <Text style={[styles.btnT]}>拍摄</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'black',
    width: windowWidth,
    height: windowHeight,
    zIndex: 999,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pic: {
    width: windowWidth,
  },
  btn: {
    width: 300,
    height: 50,
  },
  btnT: {
    color: 'white',
    fontSize: 20,
  },
  bottomContainer: {
    height: 150,
    justifyContent: 'space-evenly',
  },
  backArrow: {
    color: 'white',
    opacity: 0.6,
  },
  top: {
    width: '100%',
    justifyContent: 'flex-start',
  },
});

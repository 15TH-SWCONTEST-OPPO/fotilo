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
import React, {useEffect} from 'react';

import {useAppSelector, useAppDispatch} from '../store/hooks';
import {set, setResFile} from '../store/features/imgCSlice';
import {set as setUser} from '../store/features/userSlice';
import Button from './Button';
import StatusSpace from './StatusBarSpace';
import {ArrowBackIcon} from 'native-base';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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

  const {show, iniPic, scale} = useAppSelector(store => store.imgC);

  const dispatch = useAppDispatch();

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
                  dispatch(set({show: false}))
                dispatch(setUser({avatar: e.assets[0].uri}));
              }
            });
          }}>
          <Text style={[styles.btnT]}>从相册选择图片</Text>
        </Button>
        <Button
          style={{...styles.btn}}
          onPress={() => {
            launchCamera({mediaType: 'photo', saveToPhotos: true}, e => {
              requestCameraPermission().then(() => {
                if (e.assets) {
                  dispatch(setUser({avatar: e.assets[0].uri}));
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

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PermissionsAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Button from './Button';
import {useAppSelector, useAppDispatch} from '../store/hooks';
import {set, setImg} from '../store/features/imgDrawerSlice';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

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

export default function Upload() {
  const anim = useRef(new Animated.Value(-300)).current;
  const img = useAppSelector(s => s.imgDrawer);
  const dispatch = useAppDispatch();

  const cutIn = () => {
    Animated.timing(anim, {
      duration: 300,
      useNativeDriver: false,
      toValue: 0,
    }).start();
  };
  const cutOut = () => {
    Animated.timing(anim, {
      duration: 300,
      useNativeDriver: false,
      toValue: -300,
    }).start();
  };
  useEffect(() => {
    img.show ? cutIn() : cutOut();
    if (img.show) dispatch(setImg([]));
  }, [img.show]);
  return (
    <Animated.View style={[styles.container, {bottom: anim}]}>
      <Button
        style={styles.btn}
        onPress={() => {
          launchImageLibrary({mediaType: img.type, selectionLimit: 9}).then(
            e => {
              if (e.assets) {
                dispatch(set(false));
                dispatch(setImg(e.assets));
              }
            },
          );
        }}>
        <Text style={styles.btnT}>从相册中选择</Text>
      </Button>
      <View style={styles.divder} />
      <Button
        style={styles.btn}
        onPress={() => {
          launchCamera({mediaType: img.type}, e => {
            requestCameraPermission().then(() => {
              if (e.assets) {
                dispatch(set(false));
                dispatch(setImg(e.assets));
              }
            });
          });
        }}>
        <Text style={styles.btnT}>拍摄</Text>
      </Button>
      <View style={styles.divder} />
      <Button
        style={styles.btn}
        onPress={() => {
          dispatch(set(false));
        }}>
        <Text style={styles.btnT}>取消</Text>
      </Button>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: -100,
    left: '10%',
    width: '80%',
    backgroundColor: 'black',
    borderRadius: 5,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  btn: {
    backgroundColor: 'transparent',
    height: 80,
    width: '100%',
  },
  btnT: {
    color: 'white',
  },
  divder: {
    width: '80%',
    height: 1,
    backgroundColor: 'white',
  },
});

import {
  View,
  ImageBackground,
  StyleSheet,
  Animated,
  TouchableHighlight,
  Text,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Outlet, useLocation, useNavigate} from 'react-router-native';
import StatusBarSpace from '../../components/StatusBarSpace';
import {ArrowBackIcon} from 'native-base';
import Button from '../../components/Button';


// 头部标题
const header: {[key: string]: string} = {
  login: '登录',
  register: '注册',
  code: '验证码登录',
};

export default function Page1() {
  const [title, setTitle] = useState('');

  const navigation = useNavigate();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  let location = useLocation();

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // 头部文字判断&背景动画
  let faded = false;
  useEffect(() => {
    const loc: string = location.pathname.split(/\//)[2];
    for (let name in header) if (name === loc) setTitle(header[name]);
    if (loc && !faded) {
      fadeIn();
      faded = true;
    } else {
      setTitle('');
      fadeOut();
      faded = false;
    }
  }, [location]);

  return (
    <>
      <View style={styles.container}>
        <StatusBarSpace />
        {title ? (
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              navigation(-1);
            }}>
            <ArrowBackIcon style={styles.backArrow} />
          </TouchableHighlight>
        ) : null}
        <Text style={styles.title}>{title}</Text>

        <View style={styles.center}>
          <Outlet />
        </View>

        <Animated.View style={[styles.backgroundBlur, {opacity: fadeAnim}]}>
          <View style={styles.backgroundBlur} />
        </Animated.View>

        <ImageBackground
          style={styles.background}
          source={require('../../static/img/background.gif')}
        />
      </View>

      
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
  },
  center: {
    flexShrink: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -999,
  },
  backgroundBlur: {
    backgroundColor: 'black',
    opacity: 0.5,
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: -99,
  },
  backArrow: {
    color: 'white',
    opacity: 0.6,
  },
  title: {
    color: 'white',
    fontSize: 40,
    opacity: 0.6,
    paddingLeft: 40,
    paddingTop: 10,
  },
});

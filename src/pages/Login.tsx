import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
  Dimensions,
  TextInput,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-native';
import {ArrowBackIcon, Button} from 'native-base';

import StatusBarSpace from '../components/StatusBarSpace';
import debounce from '../utils/debounce';

/* 
  基础信息
*/
// 背景
const backWidth = Dimensions.get('screen').width;
const backHeight = Dimensions.get('screen').height;

// 组件中部宽度
const centerWidth = 320;

// 账号密码
let username: string = '';
let password: string = '';

/* 
  第三方登录
*/
const ThirdLogin=()=>{

}

export default function Login() {

  /* 
    动画
  */
  // 页面切入动画
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  
  useEffect(() => {
    fadeIn();
  }, []);

  // 按钮缩放比
  const btnClick = useRef(new Animated.Value(1)).current;
  // 按钮颜色

  const navigation = useNavigate();


  /*
  路由 
   */
  // 返回上一页
  const back = () => {
    navigation(-1);
  };

  return (
    <View style={styles.container}>
      <View>
        <StatusBarSpace />
        <TouchableHighlight underlayColor="transparent" onPress={back}>
          <ArrowBackIcon style={styles.backArrow} />
        </TouchableHighlight>
        <Text style={styles.title}>登录</Text>
      </View>

      <View style={styles.center}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            username = e;
          }, 600)}
          placeholder="用户名"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          secureTextEntry
          onChangeText={debounce(function (e: string) {
            password = e;
          }, 600)}
          placeholder="密码"
        />

        <View style={styles.others}>
          <Button variant="ghost">
            <Text style={styles.othersT}>立即注册！</Text>
          </Button>
          <Button variant="ghost">
            <Text style={styles.othersT}>忘记密码？</Text>
          </Button>
        </View>
      </View>

      <View style={styles.btnContainer}>
          <Button
            onPress={() => {
              console.log(username);
              console.log(password);
            }}
            style={styles.loginBtn}>
            登录
          </Button>
      </View>

      <Animated.View style={[styles.background, {opacity: fadeAnim}]}>
        <View style={styles.background} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },
  background: {
    backgroundColor: 'black',
    opacity: 0.5,
    width: backWidth,
    height: backHeight,
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
  input: {
    borderWidth: 1,
    borderColor: '#c0c0c0',
    color: 'white',
    borderRadius: 5,
    opacity: 0.6,
    height: 60,
    width: centerWidth,
  },
  others: {
    width: centerWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 400,
  },
  othersT: {
    fontSize: 20,
    color: '#2d9cdb',
  },
  loginBtn: {
    backgroundColor: '#2d9cdb',
    width: centerWidth,
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
});

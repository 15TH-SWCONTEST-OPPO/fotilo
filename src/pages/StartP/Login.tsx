import {View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';
import React from 'react';
import {useNavigate} from 'react-router-native';
import {Button} from 'native-base';

import debounce from '../../utils/debounce';
import {QQ, Wechat, Weibo} from '../../static/myIcon';
import {basicColor} from '../../static/color';
import MyBtn from '../../components/Button';
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
const ThirdLogin = () => {
  return (
    <View style={threeStyle.container}>
      <View style={threeStyle.iconContainer}>
        <View style={threeStyle.line} />
        <View style={threeStyle.space} />
        <Wechat />
        <View style={threeStyle.space} />
        <QQ />
        <View style={threeStyle.space} />
        <Weibo />
        <View style={threeStyle.space} />
        <View style={threeStyle.line} />
      </View>
      <Text style={threeStyle.text}>第三方登录</Text>
    </View>
  );
};

export default function Login() {
  const navigation = useNavigate();

  return (
    <View style={styles.container}>
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
          <Button
            onPress={() => {
              navigation('../register');
            }}
            variant="ghost">
            <Text style={styles.othersT}>立即注册！</Text>
          </Button>
          <Button
            onPress={() => {
              navigation('../forget');
            }}
            variant="ghost">
            <Text style={styles.othersT}>忘记密码？</Text>
          </Button>
        </View>
      </View>

      <View>
        <ThirdLogin />
      </View>

      <View style={styles.btnContainer}>
        <MyBtn
          onPress={() => {
            console.log(username);
            console.log(password);
          }}
          style={styles.loginBtn}>
          <Text style={styles.loginT}>登录</Text>
        </MyBtn>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
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
    color: basicColor,
  },
  loginBtn: {
    backgroundColor: basicColor,
    width: centerWidth,
    height: 50,
  },
  loginT: {
    color: 'white',
  },
  btnContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 40,
  },
});

const threeStyle = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: centerWidth,
  },
  line: {
    height: 1,
    width: 20,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  space: {
    width: 10,
  },
  text: {
    color: 'white',
  },
});

import {View, Text, StyleSheet, Dimensions, TextInput} from 'react-native';
import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-native';
import {Button} from 'native-base';

import debounce from '../utils/debounce';
import {Lock, QQ, Wechat, Weibo, User} from '../static/myIcon';
import {acceptColor, basicColor, errorColor} from '../static/color';
import MyBtn from './Button';
import Input from './Input';
import {login} from '../api';
/* 
  基础信息
*/
// 组件中部宽度
const centerWidth = 320;

// 账号密码
let phone: string = '';
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

  const [empty, setEmpty] = useState<{phone: boolean; password: boolean}>({
    phone: true,
    password: true,
  });

  const [otherErr,setOtherErr]=useState(true);
  const [otherMessage,setOtherMessage]=useState('');


  const onFinish = () => {
    setEmpty({phone: phone === '', password: password === ''});
    if (phone !== '' && password !== '') {
      login({phone, password})
        .then(e => {
          console.log(e);
        })
        .catch(e => {
          setOtherMessage(e.response.data.message);
          setOtherErr(false);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Input
          containerStyle={styles.input}
          textStyle={{color: 'white'}}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            phone = e;
            setEmpty({...empty, phone: e === ''});
            setOtherErr(true)
          }, 600)}
          placeholder="手机号"
          icon={[
            <User size={5} />,
            <User color={acceptColor} size={5} />,
            <User color={errorColor} size={5} />,
          ]}
          rules={[!empty.phone,otherErr]}
          errText={['请输入手机号', otherMessage]}
          />
        <Input
          containerStyle={styles.input}
          textStyle={{color: 'white'}}
          placeholderTextColor="#c0c0c0"
          secureTextEntry
          rules={[!empty.password,otherErr]}
          errText={['请输入密码', otherMessage]}
          onChangeText={debounce(function (e: string) {
            setEmpty({...empty, password: e === ''});
            setOtherErr(true)
            password = e;
          }, 600)}
          icon={[
            <Lock size={5} />,
            <Lock color={acceptColor} size={5} />,
            <Lock color={errorColor} size={5} />,
          ]}
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
              navigation('../code');
            }}
            variant="ghost">
            <Text style={styles.othersT}>验证码登录</Text>
          </Button>
        </View>
      </View>

      <View>
        <ThirdLogin />
      </View>

      <View style={styles.btnContainer}>
        <MyBtn onPress={onFinish} style={styles.loginBtn}>
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

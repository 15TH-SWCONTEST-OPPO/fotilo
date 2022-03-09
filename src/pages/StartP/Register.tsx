import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {styles} from './Login';
import debounce from '../../utils/debounce';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {passwordRule, phoneNumRule} from '../../static/regex';

let info: {[key: string]: string} = {};
// 确认密码

let a=1;

export default function Register() {
  const [password, setpassword] = useState('');
  const [same, setSame] = useState(true);

  useEffect(() => {
    console.log(a);
  }, [a]);

  return (
    <View style={styles.container}>
      <View style={rstyles.center}>
        <Input
          containerStyle={styles.input}
          placeholderTextColor="#c0c0c0"
          textStyle={rstyles.inputT}
          onChangeText={debounce(function (e: string) {
            info.username = e;
          }, 600)}
          placeholder="用户名"
        />

        <Input
          containerStyle={styles.input}
          textStyle={rstyles.inputT}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.phoneNumber = e;
          }, 600)}
          rules={phoneNumRule}
          errText="请输入正常手机号码"
          placeholder="手机号码"
        />

        <Input
          containerStyle={styles.input}
          textStyle={rstyles.inputT}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.password = e;
            setpassword(e);
          }, 600)}
          secureTextEntry
          rules={[same, passwordRule]}
          errText={['其他错误', '密码应为8-16位字母数字组合（可含字符）']}
          placeholder="密码"
        />

        <Input
          containerStyle={styles.input}
          textStyle={rstyles.inputT}
          placeholderTextColor="#c0c0c0"
          confirm
          confirmText={password}
          confirmErrorText="两次密码不一致"
          secureTextEntry
          placeholder="确认密码"
        />

        <View style={{...rstyles.verContainer,width:styles.input.width}}>
          <Input
            containerStyle={{borderColor:styles.input.borderColor,opacity:styles.input.opacity}}
            placeholderTextColor="#c0c0c0"
            textStyle={rstyles.inputT}
            onChangeText={debounce(function (e: string) {
              info.verCode = e;
            }, 600)}
            placeholder="验证码"
          />
          <Button style={rstyles.verBtn}>
            <Text style={rstyles.reT}>获取验证码</Text>
          </Button>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <Button
          onPress={() => {
            setTimeout(() => {
              setSame(false);
            }, 300);
          }}
          style={styles.loginBtn}>
          <Text style={rstyles.reT}>注册{a}</Text>
        </Button>
      </View>
    </View>
  );
}

const rstyles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 500,
  },
  reT: {
    color: 'white',
  },
  inputT: {
    color: 'white',
  },
  verContainer: {
    flexDirection: 'row',
    justifyContent:"space-between"
  },
  verBtn:{
    paddingHorizontal:15
  },
  verInput:{

  }
});

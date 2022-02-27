import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import {styles} from './Login';
import debounce from '../../utils/debounce';
import {Button} from 'native-base';

let info: {[key: string]: string} = {};

export default function Register() {
  return (
    <View style={styles.container}>

      <View style={rstyles.center}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.username = e;
          }, 600)}
          placeholder="用户名"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.phoneNumber = e;
          }, 600)}
          placeholder="手机号码"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.phoneNumber = e;
          }, 600)}
          secureTextEntry
          placeholder="密码"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.phoneNumber = e;
          }, 600)}
          secureTextEntry
          placeholder="确认密码"
        />
        <TextInput
          style={styles.input}
          placeholderTextColor="#c0c0c0"
          onChangeText={debounce(function (e: string) {
            info.verCode = e;
          }, 600)}
          placeholder="验证码"
        />
      </View>

      <View style={styles.btnContainer}>
        <Button onPress={() => {}} style={styles.loginBtn}>
          注册
        </Button>
      </View>

    </View>
  );
}

const rstyles = StyleSheet.create({
  center:{
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 500,
  }
})
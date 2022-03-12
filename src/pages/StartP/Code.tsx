import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './Login';
import Input from '../../components/Input';
import Button from '../../components/Button';
import {Message, User} from '../../static/myIcon';
import {phoneNumRule} from '../../static/regex';
import {acceptColor, errorColor, defaultColor} from '../../static/color';
import {codeLoginType} from '../../static/types';

let codeLogin: codeLoginType = {phone: '', code: ''};

export default function Code() {
  const [needT, setNeedT] = useState(false);
  const [nowNum, setNowNum] = useState(0);
  const [phoneEmpty, setPhoneEmpty] = useState<boolean | undefined>(undefined);
  const [codeEmpty, setCodeEmpty] = useState<boolean | undefined>(undefined);

  const num = useRef<number>(60);
  const time = useRef<NodeJS.Timer>();

  // button click 判断
  const click = () => {
    !time.current && setNeedT(true);
  };

  //
  useEffect(() => {
    if (needT) {
      time.current = setInterval(() => {
        num.current--;
        setNowNum(num.current);
      }, 1000);
      setNeedT(false);
    }
  }, [needT]);

  useEffect(() => {
    if (num.current <= 0) {
      clearInterval(time.current!);
      num.current = 60;
      time.current = undefined;
    }
  });

  return (
    <View style={styles.container}>
      <View style={cstyles.center}>
        <Input
          containerStyle={styles.input}
          placeholderTextColor="#c0c0c0"
          textStyle={cstyles.inputT}
          onChangeText={(e: string) => {
            setPhoneEmpty(e === '');
            codeLogin.phone = e;
          }}
          rules={[!phoneEmpty, phoneNumRule]}
          errText={['请输入手机号', '请输入正常手机号']}
          getState={e => {}}
          placeholder="手机号"
          icon={[
            <User color={defaultColor} size={5} />,
            <User color={acceptColor} size={5} />,
            <User color={errorColor} size={5} />,
          ]}
        />

        <View style={{...cstyles.verContainer, width: styles.input.width}}>
          <Input
            getState={e => {}}
            containerStyle={{
              borderColor: styles.input.borderColor,
              opacity: styles.input.opacity,
            }}
            placeholderTextColor="#c0c0c0"
            textStyle={cstyles.inputT}
            onChangeText={(e: string) => {
              setCodeEmpty(e === '');
              codeLogin.code = e;
            }}
            placeholder="验证码"
            icon={[
              <Message size={5} />,
              <Message color={acceptColor} size={5} />,
              <Message color={errorColor} size={5} />,
            ]}
            rules={[!codeEmpty]}
            errText={['请输入验证码']}
          />
          <Button
            style={cstyles.verBtn}
            onPress={() => {
              let empty = phoneEmpty;
              if (phoneEmpty === undefined) {
                setPhoneEmpty(true);
                empty = true;
              }
              !empty && click();
            }}
            unable={num.current < 60 && num.current > 0}>
            <Text style={cstyles.reT}>
              {num.current === 60 || num.current === 0
                ? '获取验证码'
                : num.current + '秒 '}
            </Text>
          </Button>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <Button onPress={() => {
          setPhoneEmpty(codeLogin.phone==='')
          setCodeEmpty(codeLogin.code==='')
        }} style={styles.loginBtn}>
          <Text style={styles.loginT}>登录</Text>
        </Button>
      </View>
    </View>
  );
}

const cstyles = StyleSheet.create({
  center: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    height: 300,
  },
  reT: {
    color: 'white',
  },
  inputT: {
    color: 'white',
  },
  verContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  verBtn: {
    paddingHorizontal: 15,
    height: styles.input.height - 10,
    width: 110,
  },
  verInput: {},
});

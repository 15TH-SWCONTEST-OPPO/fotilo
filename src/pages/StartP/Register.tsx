import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {styles} from './Login';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {passwordRule, phoneNumRule, usernameRule} from '../../static/regex';
import {userType} from '../../static/types';
import {register, sendmessage} from '../../api';

let info: userType = {username: '', password: '', code: '', phone: ''};

const infoOrder = ['username', 'phone', 'password', 'code'];

// 确认密码
export default function Register() {
  const [password, setpassword] = useState('');
  const [nowNum, setNowNum] = useState(0);
  const [needT, setNeedT] = useState(false);

  const [codeErr, setCodeErr] = useState<boolean>(true);
  const [phoneErr, setPhoneErr] = useState<boolean>(true);
  const [errMessage, setErrMessage] = useState<string>('')

  const backerrs:{[key: string]: any}={
    '验证码不匹配':setCodeErr,
    '该手机号已注册':setPhoneErr
  }

  // 必填信息为空
  const [emptyErr, setEmptyErr] = useState<
    Array<boolean | undefined> | undefined
  >();

  const err = useRef<boolean[]>(new Array(5));

  /* 
    倒计时
  */
  const time = useRef<NodeJS.Timer>();
  const num = useRef(60);

  // button click 判断
  const click = () => {
    if (info.phone === '') {
      emptyErr
        ? setEmptyErr([emptyErr[0], false, emptyErr[2], emptyErr[3]])
        : setEmptyErr([undefined, false, undefined, undefined]);
      return;
    }

    if (!time.current) {
      setNeedT(true);
      sendmessage(info.phone)
        .then(e => {
          console.log(e);
        })
        .catch(err => {
          console.log(err);
        });
    }
  };

  const onFinish = () => {
    let empty: boolean[] = [];
    let error = false;
    infoOrder.map(e => {
      empty.push(info[e] !== '');
      error = error || info[e] === '';
    });

    setEmptyErr(empty);

    err.current.map(e => {
      error = error || e;
    });


    if (!error) {
      register(info)
        .then(e => {
          console.log(e);
        })
        .catch(e => {
          setErrMessage(e.response.data.message);
          backerrs[e.response.data.message](true);
        });
    }
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
      <View style={rstyles.center}>
        <Input
          containerStyle={styles.input}
          placeholderTextColor="#c0c0c0"
          textStyle={rstyles.inputT}
          onChangeText={(e: string) => {
            info.username = e;
            emptyErr
              ? setEmptyErr([e !== '', emptyErr[1], emptyErr[2], emptyErr[3]])
              : setEmptyErr([e !== '', undefined, undefined, undefined]);
          }}
          getState={e => {
            err.current[0] = e.err;
          }}
          rules={[emptyErr ? emptyErr[0] : emptyErr, usernameRule]}
          errText={['请输入用户名', "应由4~16位英文、数字、'_'构成"]}
          placeholder="用户名"
        />

        <Input
          containerStyle={styles.input}
          textStyle={rstyles.inputT}
          placeholderTextColor="#c0c0c0"
          getState={e => {
            err.current[1] = e.err;
          }}
          onChangeText={(e: string) => {
            info.phone = e;
            emptyErr
              ? setEmptyErr([emptyErr[0], e !== '', emptyErr[2], emptyErr[3]])
              : setEmptyErr([undefined, e !== '', undefined, undefined]);
          }}
          rules={[emptyErr ? emptyErr[1] : true, phoneNumRule,phoneErr]}
          errText={['请输入手机号', '请输入正常手机号码',errMessage]}
          placeholder="手机号码"
        />

        <Input
          getState={e => {
            err.current[2] = e.err;
          }}
          containerStyle={styles.input}
          textStyle={rstyles.inputT}
          placeholderTextColor="#c0c0c0"
          onChangeText={(e: string) => {
            info.password = e;
            emptyErr
              ? setEmptyErr([emptyErr[0], emptyErr[1], e !== '', emptyErr[3]])
              : setEmptyErr([undefined, undefined, e !== '', undefined]);
            setpassword(e);
          }}
          secureTextEntry
          rules={[emptyErr ? emptyErr[2] : true, passwordRule]}
          errText={['请输入密码', '密码应为8-16位字母数字组合（可含字符）']}
          placeholder="密码"
        />

        <Input
          getState={e => {
            err.current[3] = e.err;
          }}
          containerStyle={styles.input}
          textStyle={rstyles.inputT}
          placeholderTextColor="#c0c0c0"
          confirm
          confirmText={password}
          confirmErrorText="两次密码不一致"
          secureTextEntry
          placeholder="确认密码"
        />

        <View style={{...rstyles.verContainer, width: styles.input.width}}>
          <Input
            getState={e => {
              err.current[4] = e.err;
            }}
            containerStyle={{
              borderColor: styles.input.borderColor,
              opacity: styles.input.opacity,
            }}
            placeholderTextColor="#c0c0c0"
            textStyle={rstyles.inputT}
            onChangeText={(e: string) => {
              info.code = e;
              emptyErr
                ? setEmptyErr([emptyErr[0], emptyErr[1], emptyErr[2], e !== ''])
                : setEmptyErr([undefined, undefined, undefined, e !== '']);
            }}
            rules={[emptyErr ? emptyErr[3] : emptyErr,codeErr]}
            errText={['请输入验证码',errMessage]}
            placeholder="验证码"
          />
          <Button
            style={rstyles.verBtn}
            onPress={() => {
              click();
            }}
            unable={num.current < 60 && num.current > 0}>
            <Text style={rstyles.reT}>
              {num.current === 60 || num.current === 0
                ? '获取验证码'
                : num.current + '秒 '}
            </Text>
          </Button>
        </View>
      </View>

      <View style={styles.btnContainer}>
        <Button
          onPress={() => {
            onFinish();
          }}
          style={styles.loginBtn}>
          <Text style={rstyles.reT}>注册</Text>
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
    justifyContent: 'space-between',
  },
  verBtn: {
    paddingHorizontal: 15,
    height: styles.input.height - 10,
    width: 110,
  },
});

import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {Link, useNavigate} from 'react-router-native';
import Button from '../../components/Button';

// 文字logo大小&缩放比
const logoTSize = {width: 208, height: 56};
const logoTScale = 1.3;

export default function StartP() {
  
  /* 
  首页文字淡化
  */
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
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

  useEffect(() => {
    fadeIn();
    return () => {
      fadeOut();
    };
  }, []);

  const navigate = useNavigate();

  return (
    <View style={styles.container}>

      <View />

      <View
        style={{
          height: 180,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Image
          style={styles.logoT}
          source={require('../../static/img/LOGOT.png')}
        />
        <Link activeOpacity={1} underlayColor="transparent" to="/home">
          <View style={styles.homeT}>
            <Text style={styles.homeT_t}>进入美的世界</Text>
            <Text style={styles.homeT_a}>→</Text>
          </View>
        </Link>
      </View>

      <View style={styles.bottomBar}>
        <Button
          onPress={() => {
            navigate('login');
          }}
          style={styles.loginBtn}>
          <Text style={styles.loginT}>登录 </Text>
        </Button>
        <Button
          onPress={() => {
            navigate('register');
          }}
          style={styles.regBtn}>
          <Text style={styles.regT}>注册 </Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },

  homeT: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 180,
  },
  homeT_t: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 20,
  },
  homeT_a: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: 30,
  },
  logoT: {
    width: logoTSize.width * logoTScale,
    height: logoTSize.height * logoTScale,
  },
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 50,
  },
  loginBtn: {
    width: '43%',
    height: 50,
    borderWidth: 2,
    backgroundColor: 'white',
  },
  regBtn: {
    width: '43%',
    height: 50,
    borderWidth: 2,
    backgroundColor: 'black',
  },
  loginT: {
    fontSize: 20,
    fontFamily: 'Roboto',
  },
  regT: {
    color: 'white',
    fontSize: 20,
    fontFamily: 'Roboto',
  },
});

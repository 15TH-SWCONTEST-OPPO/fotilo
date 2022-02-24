import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  Animated,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {useNavigate} from 'react-router-native';
import {useAppSelector} from '../store/hooks';


import StatusBarSpace from '../components/StatusBarSpace';
import {ArrowBackIcon} from 'native-base';

export default function Login() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isHome = useAppSelector(store => store.isHome);
  
  
  const fadeIn = () => {
    console.log(isHome);
    Animated.timing(fadeAnim, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, []);

  const navigation = useNavigate();

  const back = () => {
    navigation(-1);
  };

  return (
    <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
      <View style={styles.container}>
        <StatusBarSpace />
        <TouchableHighlight underlayColor="transparent" onPress={back}>
          <ArrowBackIcon style={styles.backArrow} />
        </TouchableHighlight>
        <Text>Login</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    opacity: 0.5,
    height: '100%',
    width: '100%',
  },
  backArrow: {
    color: 'white',
  },
});

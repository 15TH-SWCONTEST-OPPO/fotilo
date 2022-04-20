import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableHighlight,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Add, Loading} from '../../static/myIcon';
import Button from '../../components/Button';
import DynamicCard, {basicDynamic} from '../../components/DynamicCard';
import {getDynamicList} from '../../api';
import DynamicCrate from './DynamicCreate';
import {ArrowBackIcon} from 'native-base';
import {useAppSelector} from '../../store/hooks';

export default function Dynamic() {
  const [dynamic, setDynamic] = useState<Array<basicDynamic>>([]);
  const [isEdit, setIsEdit] = useState(false);
  const user = useAppSelector(s => s.user);

  /* 
    动画
  */
  const fade = useRef(new Animated.Value(1)).current;
  const cut = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(fade, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const cutIn = () => {
    Animated.timing(cut, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };
  const cutOut = () => {
    Animated.timing(cut, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const cutAnim = cut.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    getDynamicList(5)
      .then(e => {
        setDynamic(e.data.data);
      })
      .catch(e => {
        console.log('dynamic Error', e);
      });
  }, []);

  useEffect(() => {
    if (isEdit) {
      fadeOut();
      cutIn();
    } else {
      fadeIn();
      cutOut();
    }
  }, [isEdit]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.createD, {height: cutAnim}]}>
        <View>
          <TouchableHighlight
            underlayColor="transparent"
            style={{width: 30}}
            onPress={() => {
              setIsEdit(false);
            }}>
            <ArrowBackIcon style={{color: 'white'}} />
          </TouchableHighlight>
          <DynamicCrate userId={user.userId||''}/>
        </View>
      </Animated.View>
      <ScrollView style={styles.scrollView}>
        {dynamic.map(d => {
          return (
            <>
              <DynamicCard key={d.userId} {...d} />
              <View style={styles.space} />
            </>
          );
        })}
        <View style={styles.space} />
      </ScrollView>

      {user.userId!=='' && (
        <Animated.View style={{opacity: fade}}>
          <Button
            style={styles.addBtn}
            onPress={() => {
              setIsEdit(true);
            }}>
            <Add size={12} />
          </Button>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#fa7161',
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 80,
    right: 30,
  },
  scrollView: {
    padding: 20,
  },
  container: {
    // backgroundColor:'blue',
    width: '100%',
    height: '100%',
  },
  space: {
    width: 20,
    height: 30,
  },
  createD: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
});

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  TouchableHighlight,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Add, Loading} from '../../static/myIcon';
import Button from '../../components/Button';
import DynamicCard, {basicDynamic} from '../../components/DynamicCard';
import {getDynamicList} from '../../api';
import DynamicCrate from './DynamicCreate';
import {ArrowBackIcon} from 'native-base';
import {useAppSelector} from '../../store/hooks';
import uuid from 'uuid';
import { basicColor } from '../../static/color';


const wait = (timeout: number) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

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
    getDynamicList(12, user.userId)
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

  // 刷新
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(8000).then(() => setRefreshing(false));
  }, []);

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
          {isEdit && (
            <DynamicCrate
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              userId={user.userId || ''}
            />
          )}
        </View>
      </Animated.View>
      <ScrollView
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[basicColor]}
        />
      }
      onScroll={e => {
        const val = e.nativeEvent;
        if (
          Math.abs(
            val.contentOffset.y +
              val.layoutMeasurement.height -
              val.contentSize.height,
          ) < 1e-3
        ) {
          console.log('lazyload');
        }
      }}
      style={styles.scrollView}>
        {dynamic.map(d => {
          return (
            <View key={uuid.v4()}>
              <DynamicCard {...d} />
              <View style={styles.space} />
            </View>
          );
        })}
        <View style={styles.space} />
      </ScrollView>

      {user.userId !== '' && (
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

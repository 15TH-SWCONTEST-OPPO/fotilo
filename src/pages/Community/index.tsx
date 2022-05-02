import {View, Text, Image, StyleSheet, TouchableHighlight} from 'react-native';
import React, {useState} from 'react';
import Button from '../../components/Button';
import {basicColor} from '../../static/color';
import {ArrowBackIcon} from 'native-base';
import {useNavigate} from 'react-router-native';
import Drawer from '../../components/Drawer';

export default function Community() {
  const [myStar, setMyStar] = useState(true);
  const navigation = useNavigate();
  return (
    <View style={{alignItems: 'center'}}>
      <View
        style={{
          width: '100%',
          height: 50,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableHighlight
          underlayColor="transparent"
          style={{width: 30}}
          onPress={() => {
            navigation(-1);
          }}>
          <ArrowBackIcon style={styles.backArrow} />
        </TouchableHighlight>
        <View>
          <Text style={{color: 'white', fontSize: 20}}>
            社区&nbsp;&nbsp;&nbsp;&nbsp;
          </Text>
        </View>
        <View />
      </View>
      <View
        style={{
          flexDirection: 'row',
          width: '60%',
          justifyContent: 'space-between',
        }}>
        <Button
          onPress={() => {
            setMyStar(true);
          }}
          style={{
            ...styles.topBtn,
            borderBottomWidth: myStar ? 2 : 0,
          }}>
          <Text style={[styles.topT, {color: myStar ? basicColor : 'white'}]}>
            我的关注
          </Text>
        </Button>
        <Button
          onPress={() => {
            setMyStar(false);
          }}
          style={{
            ...styles.topBtn,
            borderBottomWidth: !myStar ? 2 : 0,
          }}>
          <Text style={[styles.topT, {color: !myStar ? basicColor : 'white'}]}>
            我的粉丝
          </Text>
        </Button>
      </View>
      <View style={{width: 2, height: 20}} />
      <View style={{width: '100%'}}>
        <View style={{alignItems: 'center'}}>
          <View
            style={{
              backgroundColor: 'transparent',
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              width: '100%',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row'}}>
              <Button style={{width: 50, height: 50, borderRadius: 25}}>
                <Image
                  style={{width: 50, height: 50, borderRadius: 25}}
                  source={require('../../static/img/defaultAvatar.png')}
                />
              </Button>
              <View>
                <Text style={{color: 'white', fontSize: 20}}>123</Text>
                <Text style={{color: '#c0c0c0'}}>
                  bilibili 2020百大UP主、知名影视UP主
                </Text>
              </View>
            </View>
              <Drawer
              style={{paddingHorizontal: 8, height: 40}}
                position="bottom"
                drawers={
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      backgroundColor: 'white',
                    }}></View>
                }>
                <Text style={{color: 'white'}}>已关注</Text>
              </Drawer>
          </View>
          <View
            style={{
              width: '98%',
              height: 8,
              borderBottomColor: '#c0c0c0',
              borderBottomWidth: 1,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBtn: {
    backgroundColor: 'transparent',
    borderBottomWidth: 2,
    borderBottomColor: basicColor,
  },
  topT: {
    color: 'white',
    fontSize: 20,
  },
  backArrow: {
    color: 'white',
    opacity: 0.6,
  },
});

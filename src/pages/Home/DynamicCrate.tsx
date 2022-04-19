import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Actionsheet, TextArea} from 'native-base';
import Button from '../../components/Button';
import {Camera, Pic, Trash} from '../../static/myIcon';
import {set} from '../../store/features/imgDrawerSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {defaultColor} from '../../static/color';

export default function DynamicCrate() {
  const dispatch = useAppDispatch();
  const [pics, setPics] = useState<any[]>([]);

  const [upLPic, setUpLPic] = useState(false);

  const {pics: nowpics} = useAppSelector(s => s.imgDrawer);

  useEffect(() => {
    setPics([...pics, ...nowpics]);
  }, [nowpics]);

  return (
    <View style={styles.container}>
      <TextArea
        placeholder="记录生活的美..."
        fontSize={20}
        maxH={200}
        color="white"
      />
      <ScrollView style={{marginTop: 5}}>
        <View style={styles.pics}>
          {pics.map(p => {
            return (
              <View key={p.uri} style={styles.picC}>
                <Button style={styles.picBtn} onPress={() =>{
                  const nowPics=pics.filter(a=>{return a.uri!==p.uri})
                  setPics([...nowPics])
                }}>
                  <Trash color={defaultColor} size={5}/>
                </Button>
                <Image style={styles.myPics} source={{uri: p.uri}} />
              </View>
            );
          })}

          <Button
            style={styles.addPic}
            onPress={() => {
              dispatch(set(true));
            }}>
            <Pic />
            <Text style={styles.picT}>上传图片&nbsp;</Text>
          </Button>
        </View>
        <View style={{width: 20, height: 320}} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  text: {
    color: 'white',
  },
  addPic: {
    backgroundColor: 'transparent',
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    borderStyle: 'dashed',
  },
  pics: {
    marginTop: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  picT: {
    color: 'white',
  },
  myPics: {
    width: 160,
    height: 160,
  },
  picBtn: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex:99,
    top:2,
    right:0
  },
  picC: {
    marginRight: 20,
    marginBottom: 20,
  },
});

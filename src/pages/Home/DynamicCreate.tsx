import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {TextArea} from 'native-base';
import Button from '../../components/Button';
import {Pic, Trash} from '../../static/myIcon';
import {set,setType} from '../../store/features/imgDrawerSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import uuid from 'uuid';
import {uploadImg} from '../../api';
import {AliyunVodFileUpload} from '../../utils/aliyun-vod-payload';

export default function DynamicCrate(props: {userId: string}) {
  const dispatch = useAppDispatch();
  const [pics, setPics] = useState<any[]>([]);
  const {userId} = props;

  const {pics: nowpics} = useAppSelector(s => s.imgDrawer);

  useEffect(() => {
    dispatch(setType('photo'))
  },[])

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
      <View style={{width: '100%', alignItems: 'flex-end'}}>
        <Button
          style={styles.submitBtn}
          onPress={() => {
            pics.map(p => {
              const imageExt: 'png' | 'jpg' | 'jpeg' | 'gif' =
                p.type.split(/\//)[1];
              const title = userId + 'dynamic' + uuid.v4();
              uploadImg({title, imageType: 'DEFAULT', imageExt})
                .then(e => {
                  console.log(e);
                  
                })
                .catch(e => {
                  console.log(e);
                });
            });
          }}>
          <Text style={styles.submitT}>发布</Text>
        </Button>
      </View>
      <ScrollView style={{marginTop: 5}}>
        <View style={styles.pics}>
          {pics.map(p => {
            return (
              <View key={p.uri} style={styles.picC}>
                <Button
                  style={styles.picBtn}
                  onPress={() => {
                    const nowPics = pics.filter(a => {
                      return a.uri !== p.uri;
                    });
                    setPics([...nowPics]);
                  }}>
                  <Trash size={5} />
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
        <View style={{width: 20, height: 400}} />
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
    backgroundColor: '#4d4d4dd6',
    width: 30,
    height: 30,
    zIndex: 99,
    top: 2,
    right: 0,
  },
  picC: {
    marginRight: 20,
    marginBottom: 20,
  },
  submitBtn: {
    width: 80,
    height: 40,
    marginTop: 5,
  },
  submitT: {
    color: 'white',
    fontSize: 20,
  },
});

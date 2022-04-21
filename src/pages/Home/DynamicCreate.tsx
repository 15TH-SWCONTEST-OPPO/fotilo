import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {TextArea} from 'native-base';
import Button from '../../components/Button';
import {Pic, Trash} from '../../static/myIcon';
import {set, setType} from '../../store/features/imgDrawerSlice';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import uuid from 'uuid';
import {uploadImg} from '../../api';
import {
  AliyunVodFileUpload,
  AliyunVodFileUploadEmitter,
} from '../../utils/aliyun-vod-payload';

export default function DynamicCrate(props: {userId: string}) {
  const dispatch = useAppDispatch();
  const [pics, setPics] = useState<any[]>([]);
  const {userId} = props;

  const {pics: nowpics} = useAppSelector(s => s.imgDrawer);

  const nowNum = useRef(0);
  const data = useRef<
    {
      videoId: string;
      uploadAuth: string;
      uploadAddress: string;
      path: string;
      type: string;
      title: string;
    }[]
  >([]);

  useEffect(() => {
    dispatch(setType('photo'));
  }, []);

  useEffect(() => {
    setPics([...pics, ...nowpics]);
  }, [nowpics]);

  useEffect(() => {
    AliyunVodFileUploadEmitter.addListener(
      'OnUploadProgress',
      (result: any) => {
        console.log(Math.floor(result.progress*100)+'%');
        
        if (result.progress === 1) {
          nowNum.current += 1;
          if (nowNum.current < data.current.length) {
            AliyunVodFileUpload.init(
              {
                videoId: data.current[nowNum.current].videoId,
                uploadAuth: data.current[nowNum.current].uploadAuth,
                uploadAddress: data.current[nowNum.current].uploadAddress,
              },
              res => {
                console.log(res);
              },
            );
            AliyunVodFileUpload.addFile({
              path: data.current[nowNum.current].path,
              type: data.current[nowNum.current].type,
              title: data.current[nowNum.current].title,
              desc: '',
              tags: '',
              cateId: 1,
            });
            AliyunVodFileUpload.start();
          }
        }
      },
    );
    AliyunVodFileUploadEmitter.addListener('onUploadSucceed', (result: any) => {
      console.log('[succeed]', result);
    });
  }, []);

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
            pics.map((p, index) => {
              const title = userId + 'dynamic' + uuid.v4();
              const imageExt: 'png' | 'jpg' | 'jpeg' | 'gif' =
                p.type.split(/\//)[1];
              uploadImg({title, imageType: 'DEFAULT', imageExt})
                .then(e => {
                  data.current.push({
                    videoId: e.data.data.imageId,
                    uploadAuth: e.data.data.uploadAuth,
                    uploadAddress: e.data.data.uploadAddress,
                    path: p.uri.split(/^file:\/\//)[1],
                    type: p.type,
                    title,
                  });
                  if (index === pics.length - 1) {
                    AliyunVodFileUpload.init(
                      {
                        videoId: data.current[0].videoId,
                        uploadAuth: data.current[0].uploadAuth,
                        uploadAddress: data.current[0].uploadAddress,
                      },
                      res => {
                        console.log(res);
                      },
                    );
                    AliyunVodFileUpload.addFile({
                      path: data.current[0].path,
                      type: data.current[0].type,
                      title: data.current[0].title,
                      desc: '',
                      tags: '',
                      cateId: 1,
                    });
                    AliyunVodFileUpload.start();
                  }
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
              <View key={uuid.v4()} style={styles.picC}>
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

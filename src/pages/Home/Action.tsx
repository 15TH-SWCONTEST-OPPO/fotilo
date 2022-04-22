import {View, Text, StyleSheet, PermissionsAndroid} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Button from '../../components/Button';
import {Pic, Upload} from '../../static/myIcon';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAppSelector} from '../../store/hooks';
import {
  AliyunVodFileUpload,
  AliyunVodFileUploadEmitter,
} from '../../utils/aliyun-vod-payload';
import {finishUpload, finishUploadV, uploadImg, uploadVideo} from '../../api';
import uuid from 'uuid';
import Input from '../../components/Input';
import {TextArea} from 'native-base';
import {errorColor} from '../../static/color';

export default function Action() {
  const [loading, setLoading] = useState(false);

  const image = useRef<{
    path: string;
    type: string;
    imageExt: 'png' | 'jpg' | 'jpeg' | 'gif';
    imageId: string;
  }>({
    path: '',
    type: '',
    imageExt: 'png',
    imageId: '',
  });

  const {userId} = useAppSelector(s => s.user);
  const video = useRef({path: '', type: '', videoId: ''});

  const title = useRef('123');
  const description = useRef('');
  const coverFinish = useRef(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const s = AliyunVodFileUploadEmitter.addListener(
      'OnUploadProgress',
      (result: any) => {
        console.log(Math.floor(result.progress * 100) + '%');

        if (result.progress === 1 && !coverFinish.current) {
          coverFinish.current = true;
          finishUpload(image.current.imageId).then(e => {
            const fileName = userId + 'video' + uuid.v4() + '.mp4';
            uploadVideo({
              title: title.current,
              coverURL: e.data.data.url,
              fileName,
              description: description.current,
            }).then(res => {
              video.current.videoId = res.data.data.videoId;

              AliyunVodFileUpload.init(
                {
                  videoId: res.data.data.videoId,
                  uploadAuth: res.data.data.uploadAuth,
                  uploadAddress: res.data.data.uploadAddress,
                },
                res => {
                  console.log(res);
                },
              );

              AliyunVodFileUpload.addFile({
                path: video.current.path,
                type: video.current.type,
                title: title.current,
                desc: '',
                tags: '',
                cateId: 1,
              });
              AliyunVodFileUpload.start();
            });
          });
        } else if (result.progress === 1) {
          finishUploadV(video.current.videoId).then(e => {
            console.log('video finish', e);
          });
        }
      },
    );
    return () => {
      s.remove();
    };
  }, []);

  const onPress = () => {
    setLoading(true);
    if (image.current.path) {
      uploadImg({
        title: title.current || 'unamed',
        imageType: 'COVER',
        imageExt: image.current.imageExt,
      }).then(res => {
        image.current.imageId = res.data.data.imageId;
        AliyunVodFileUpload.init(
          {
            videoId: res.data.data.imageId,
            uploadAuth: res.data.data.uploadAuth,
            uploadAddress: res.data.data.uploadAddress,
          },
          res => {
            console.log(res);
          },
        );
        console.log(image.current);

        AliyunVodFileUpload.addFile({
          path: image.current.path,
          type: image.current.type,
          title: title.current,
          desc: '',
          tags: '',
          cateId: 1,
        });
        AliyunVodFileUpload.start();
      });
    } else {
      coverFinish.current = true;
      const fileName = userId + 'video' + uuid.v4() + '.mp4';
      uploadVideo({
        title: title.current,
        fileName,
        description: description.current,
      }).then(res => {
        video.current.videoId = res.data.data.videoId;
        console.log(res);

        AliyunVodFileUpload.init(
          {
            videoId: res.data.data.videoId,
            uploadAuth: res.data.data.uploadAuth,
            uploadAddress: res.data.data.uploadAddress,
          },
          res => {
            console.log(res);
          },
        );
        console.log(video.current);

        AliyunVodFileUpload.addFile({
          path: video.current.path,
          type: video.current.type,
          title: title.current,
          desc: '',
          tags: '',
          cateId: 1,
        });
        AliyunVodFileUpload.start();
      });
    }
  };

  return (
    <View style={{padding: 12, height: '80%', justifyContent: 'space-evenly'}}>
      <TextArea
        color="white"
        style={{flexGrow: 1}}
        placeholder="视频标题..."
        onChangeText={e => {
          title.current = e;
        }}
      />
      <TextArea
        color="white"
        style={{flexGrow: 1}}
        placeholder="视频描述..."
        onChangeText={e => {
          description.current = e;
        }}
      />
      <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
        <Button
          onPress={() => {
            setLoading(true);
            launchImageLibrary({mediaType: 'photo'}, e => {
              if (e.assets) {
                image.current.imageExt = e.assets[0].type!.split(
                  /\//,
                )[1] as any;
                image.current.path = e.assets![0].uri!.split(/^file:\/\//)[1];
                image.current.type = e.assets![0].type || '';
              }
            });
          }}
          style={styles.button}>
          <Pic size={12} />
          <Text style={{color: 'white'}}>上传封面&nbsp;&nbsp;</Text>
        </Button>
        <Button
          onPress={() => {
            launchImageLibrary({mediaType: 'video'}, e => {
              if (e.assets) {
                video.current.path = e.assets![0].uri || '';
                video.current.type = e.assets![0].type || '';
              }
            });
          }}
          style={styles.button}>
          <Upload size={12} />
          <Text style={{color: 'white'}}>上传视频&nbsp;&nbsp;</Text>
        </Button>
      </View>
      <View style={{alignItems: 'center'}}>
        {error && (
          <>
            {title.current === '' && (
              <Text style={{color: errorColor}}>请填写视频标题</Text>
            )}
            {video.current.path === '' && (
              <Text style={{color: errorColor}}>请上传视频</Text>
            )}
          </>
        )}
        <Button
          style={{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: 'white',
            width: '80%',
            height: 40,
          }}
          onPress={onPress}>
          <Text style={{color: 'white'}}>提交</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    backgroundColor: 'transparent',
    borderColor: 'white',
    borderWidth: 1,
  },
});

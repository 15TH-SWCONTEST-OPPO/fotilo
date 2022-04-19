import {View, Text, PanResponder, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import VideoPlayer from 'react-native-video';
import {getVideo, getVideoList} from '../../api';

export default function Video() {
  const [videoNum, setVideoNum] = useState(0);
  const [vIds, setVIds] = useState<Array<string>>([]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (_, b) => {
        if (b.dy < 0) {
          if (videoNum === 0) {
            getVideoList(1)
              .then(e => {
                setVIds([e.data.data[0].videoId, ...vIds]);
              })
              .catch(e => {
                console.log('video videolist error',e);
              });
          } else {
            getVideo(vIds[videoNum - 1])
              .then(e => {
                console.log(e);
                setVideoNum(videoNum - 1);
              })
              .catch(e => {
                console.log('video getvideo error',e);
              });
          }
        } else {
          getVideoList(1)
            .then(e => {
              setVIds([...vIds, e.data.data[0].videoId]);
              setVideoNum(videoNum + 1);
            })
            .catch(e => {
              console.log('video getlist error',e);
            });
        }
      },
      onPanResponderRelease: () => {},
    }),
  ).current;

  useEffect(() => {
    getVideoList(1)
      .then(e => {
        setVIds([...vIds, e.data.data[0].videoId]);
        setVideoNum(videoNum + 1);
      })
      .catch(e => {
        console.log('video get 2nd list error',e);
      });
  }, []);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {/* <VideoPlayer/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
});

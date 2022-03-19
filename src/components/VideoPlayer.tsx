import {View, Text, Pressable, StyleSheet, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import Video from 'react-native-video';

interface VideoPlayerProps {
  style?: ViewStyle;
}

export default function VideoPlayer(props: VideoPlayerProps) {
  const [showControl, setShowControl] = useState<boolean>(false);
  const {style} = props;

  return (
    <View style={{...style}}>
      <View style={styles.header}></View>
      <Pressable
        onPress={() => {
          setShowControl(!showControl);
        }}>
        <Video
          source={{
            uri: 'https://vd3.bdstatic.com/mda-ka966fpjqpgy5a4e/v1-cae/sc/mda-ka966fpjqpgy5a4e.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1647591178-0-0-7cbba8d1ee38d14e310f7eb9d76d4a07&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=2578197149&vid=7374485987139761484&abtest=100815_1-17451_2&klogid=2578197149',
          }}
          style={{backgroundColor: 'black', width: '100%', height: '100%'}}
          resizeMode="contain"
          repeat
        />
      </Pressable>
      <View style={styles.footer}></View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  footer:{
    width: '100%',
    height:'20%',
    backgroundColor:'black',
    position: 'absolute',
    bottom: 0,
    opacity:0.5,
    zIndex:999
  },
  header:{
    width: '100%',
    height:'20%',
    backgroundColor:'black',
    position: 'absolute',
    opacity:0.5,
    top:0,
    zIndex:999
  }
});

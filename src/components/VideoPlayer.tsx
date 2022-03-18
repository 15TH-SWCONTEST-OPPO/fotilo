import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'
import Video from 'react-native-video'

export default function VideoPlayer() {
  return (
    <Pressable onPress={() =>{

    }}>
      <Video
            source={{uri:"https://vd3.bdstatic.com/mda-ka966fpjqpgy5a4e/v1-cae/sc/mda-ka966fpjqpgy5a4e.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1647591178-0-0-7cbba8d1ee38d14e310f7eb9d76d4a07&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=2578197149&vid=7374485987139761484&abtest=100815_1-17451_2&klogid=2578197149"}}
            style={{backgroundColor:'black',width:'100%',height:'40%'}}
            resizeMode='contain'
            repeat
        />
        <View >

        </View>
    </Pressable>
  )
}

const styles= StyleSheet.create({
    
})
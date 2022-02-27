import { View, Text } from 'react-native'
import React from 'react'
import {Link} from 'react-router-native';
import Video from 'react-native-video';

export default function Home() {
  return (
    <View>
      <Text>Home</Text>
      <Video style={{width: '100%', height: '100%'}} source={{uri:"https://vd3.bdstatic.com/mda-ka966fpjqpgy5a4e/v1-cae/sc/mda-ka966fpjqpgy5a4e.mp4?v_from_s=hkapp-haokan-hbe&auth_key=1645959742-0-0-637dce8847b72a330b91dc86d47af67b&bcevod_channel=searchbox_feed&pd=1&cd=0&pt=3&logid=1942798717&vid=7374485987139761484&abtest=100815_1-17451_1-3000211_5&klogid=1942798717"}}/>
      <Link to="/login">
          <Text>
              login
          </Text>
      </Link>
    </View>
  )
}
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Button from '../../components/Button'
import { Upload } from '../../static/myIcon'

export default function Action() {
  return (
    <View>
      <Button
      
      style={styles.button}>
        <Upload size={12}/>
        <Text style={{color:'white'}}>
          上传视频&nbsp;&nbsp;
        </Text>
      </Button>
    </View>
  )
}

const styles= StyleSheet.create({
  button:{
    width:100,
    height:100,
    backgroundColor:'transparent',
    borderColor:'white',
    borderWidth:1
  }
})
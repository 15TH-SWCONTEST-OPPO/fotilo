import { PressableProps, Pressable } from 'react-native'
import React from 'react'

interface BtnProps extends PressableProps{

}

export default function Button(props:BtnProps) {

    

  return (
    <Pressable {...props}>
      
    </Pressable>
  )
}
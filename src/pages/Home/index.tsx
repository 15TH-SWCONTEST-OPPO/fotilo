import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import StatusBarSpace from '../../components/StatusBarSpace';
import TopBar from '../../components/TopBar';
import BottomBar from '../../components/BottomBar';

export default function Home() {
  return (
    <View style={styles.container}>
      <StatusBarSpace />
      <TopBar />
      <View style={{...styles.center}}></View>
      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  center: {
    flexGrow: 1,
  },
});

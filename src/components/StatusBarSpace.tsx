import {View, StatusBar, StyleSheet} from 'react-native';
import React from 'react';

const statusBarH = StatusBar.currentHeight || 0;

export default function StatusBarSpace() {
  return <View style={styles.space} />;
}

const styles = StyleSheet.create({
  space: {
    height: statusBarH,
    width: '100%',
    backgroundColor:'transparent',
  },
});

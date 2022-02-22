import {View, StyleSheet, TextInput} from 'react-native';
import React from 'react';
import { HStack, Spinner,Heading} from 'native-base';

export default function SearchBar() {
  const search = () => {};

  return (
    <HStack space={2} justifyContent="center">
      <Spinner accessibilityLabel="Loading posts" />
    </HStack>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    backgroundColor: 'red',
    width: 60,
    borderRadius: 25,
  },
});

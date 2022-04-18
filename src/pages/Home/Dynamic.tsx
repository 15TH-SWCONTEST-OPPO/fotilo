import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Add, Loading} from '../../static/myIcon';
import Button from '../../components/Button';
import DynamicCard, {basicDynamic} from '../../components/DynamicCard';
import {getDynamicList} from '../../api';

export default function Dynamic() {
  const [dynamic, setDynamic] = useState<Array<basicDynamic>>([]);
  useEffect(() => {
    getDynamicList(5)
      .then(e => {
        setDynamic(e.data.data)

      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {dynamic.map(d =>{
          return (
          <>
          <DynamicCard key={d.userId} {...d}/>
          <View style={styles.space}/>
          </>
          
          )

        })}
        <View style={styles.space}/>
      </ScrollView>
      <Button style={styles.addBtn}>
        <Add size={12} />
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    backgroundColor: '#fa7161',
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    bottom: 80,
    right: 30,
  },
  scrollView: {
    padding: 20,
  },
  container: {
    // backgroundColor:'blue',
    width: '100%',
    height: '100%',
  },space:{
    width:20,
    height:30
  }
});

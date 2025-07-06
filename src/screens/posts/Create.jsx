import {View, Text, StyleSheet} from 'react-native';

import React from 'react';

export default function PostCreate() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Posts Create</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
});
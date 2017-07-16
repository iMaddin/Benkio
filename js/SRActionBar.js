// @flow
import React from 'react'
import { AppRegistry, Button, StyleSheet, View } from 'react-native'

export default class SRActionBar extends React.Component {

  render() {
    return (
      <View style={styles.actionBar}>
        <View style={[styles.actionBarItem, {backgroundColor: 'powderblue'}]}>
          <Button color={buttonTintColor} title='🔜' onPress={() => ({})} />
        </View>
        <View style={[styles.actionBarItem, {backgroundColor: 'skyblue'}]}>
          <Button color={buttonTintColor} title='🆕' onPress={() => ({})} />
        </View>
        <View style={[styles.actionBarItem, {backgroundColor: 'steelblue'}]}>
          <Button color={buttonTintColor} title='⚙️' onPress={() => ({})} />
        </View>
      </View>
    );
  }

}

const buttonTintColor = 'white'

const styles = StyleSheet.create({
  actionBar: {
    backgroundColor: 'red',
    flexDirection: 'row',
    height: 44,
  },
  actionBarItem: {
    flex:1,
  },
})

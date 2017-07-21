import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native'

export const tintColor = '#48BEE0'

export default class SRSettings extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor }) => (
      <Text>⚙️</Text>
    ),
  }

  render() {
    return (
      <View />
    )
  }

}

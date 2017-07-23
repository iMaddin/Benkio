// @flow
import React from 'react'
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import SRRatingView from './SRRatingView'

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
      null
    )
  }

}

// @flow
import React from 'react'
import {
  Modal,
  ListView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native'

export default class SRFloatingButton extends React.Component {

  render() {
    const { children, style, onPress } = this.props

    return(
      <TouchableOpacity
        style={style}
        onPress={onPress}>

        {children}

      </TouchableOpacity>
    )
  }
}

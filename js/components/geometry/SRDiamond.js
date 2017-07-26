// @flow
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

export default class SRDiamond extends Component {

  props: {
    sideLength: number,
    backgroundColor: string,
  }

  render() {
    const { sideLength, backgroundColor } = this.props
    const properties = {
      width: sideLength,
      height: sideLength,
      backgroundColor: backgroundColor,
    }
    return <View style={[styles.diamond, properties]} />
  }

}

const styles = StyleSheet.create({
  diamond: {
      width: 50,
      height: 50,
      backgroundColor: 'red',
      transform: [
        {rotate: '45deg'}
      ]
  }
})

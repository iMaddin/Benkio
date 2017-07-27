// @flow
import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'

import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from '../utilities/SRColors'

export default class SREmptyStateHeader extends Component {

  render() {
    return (
      <View style={styles.emptyStateHeaderBackground}>
        <View style={styles.circle} />
        <View style={styles.rectangle} />
        <View style={styles.triangleContainer}>
          <View style={styles.triangle} />
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  emptyStateHeaderBackground: {
    backgroundColor: SRDarkColor,
    padding: 18,
  },
  circle: {
    backgroundColor: SRRedColor,
    borderRadius: 38/2,
    height: 38,
    width: 38
  },
  rectangle: {
    backgroundColor: SRBrightColor,
    height: 85,
    width: 135,
    marginTop:28,
    marginBottom: 16,
  },
  triangleContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 19,
    borderRightWidth: 19,
    borderBottomWidth: 38,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: SRYellowColor
 }
})

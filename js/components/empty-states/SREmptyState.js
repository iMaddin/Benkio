// @flow
import React from 'react'
import { StyleSheet, View } from 'react-native'

const side = 38
const shapeColor = 'rgba(57, 62, 65, 0.2)'

export default class SREmptyState extends React.Component {

  render() {
    return(
      <View style={[this.props.style, styles.containerView]}>
        <View style={[styles.shapes, styles.circle]} />
        <View style={[styles.shapes, styles.triangle]} />
        <View style={[styles.shapes, styles.square]} />
      </View>
    )
  }
  
}

const styles = StyleSheet.create({
  containerView: {
    height: side,
    width: side*2,
  },
  shapes: {
    opacity: 0.5,
    position: 'absolute',
  },
  circle: {
    backgroundColor: shapeColor,
    width: side,
    height: side,
    borderRadius: side/2,
    left: 0,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: side/2,
    borderRightWidth: side/2,
    borderBottomWidth: side,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: shapeColor,
    right: 0,
  },
  square: {
    backgroundColor: shapeColor,
    width: side,
    height: side,
    left: side/2,
  },
})

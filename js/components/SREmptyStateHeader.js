// @flow
import React, { Component } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from '../utilities/SRColors'

const tapsUntilDisappearance = 5
const maxScale = 1.5

var circleTapCount = 0
var rectangleTapCount = 0
var triangleTapCount = 5

export default class SREmptyStateHeader extends Component {

  componentWillMount(){
    this.updateUIStates(this.props)
    this.rectangleAnimation = new Animated.Value(1)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {
    const transform = {
      transform: [{
        scaleX: this.rectangleAnimation.interpolate({
          inputRange: [0, maxScale],
          outputRange: [0, maxScale]
        })},
        {
        scaleY: this.rectangleAnimation.interpolate({
          inputRange: [0, maxScale],
          outputRange: [0, maxScale]
        })
      }]
    }

    return (
      <View style={styles.emptyStateHeaderBackground}>

        <TouchableWithoutFeedback
          onPressIn={() => {

          }}
          onPressOut={() => {

          }}
        >
          <View style={styles.circle} />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPressIn={() => {
            this.animateInRectangle(true)
          }}
          onPressOut={() => {
            this.animateInRectangle(false)
          }}
        >
          <Animated.View style={[styles.rectangle, transform]} />
        </TouchableWithoutFeedback>

        <View style={styles.triangleContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => {

            }}
            onPressOut={() => {

            }}
          >
            <View style={styles.triangle} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  updateUIStates(props: Object) {

  }

  animateInCircle(flag) {
    if(flag) {

    } else {

    }
  }

  animateInRectangle(flag: bool) {
    var toValue = flag ? 1.5 : 1

    if(flag) {
      rectangleTapCount = rectangleTapCount + 1
    } else {
      if(rectangleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    Animated.spring(
      this.rectangleAnimation,
      {
        toValue: toValue,
        speed: 12,
        bounciness: 10,
      }
    ).start()
  }

  animateInCircle(flag: bool) {
    if(flag) {

    } else {

    }
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

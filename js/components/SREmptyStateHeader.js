// @flow
import React, { Component } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import PropTypes from 'prop-types';

import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from '../utilities/SRColors'

const tapsUntilDisappearance = 5
const maxScale = 1.5

var circleTapCount = 0
var rectangleTapCount = 0
var triangleTapCount = 0

export default class SREmptyStateHeader extends Component {

  componentWillMount(){
    this.circleAnimation = new Animated.Value(1)
    this.rectangleAnimation = new Animated.Value(1)
    this.triangleAnimation = new Animated.Value(1)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {
    return (
      <View style={styles.emptyStateHeaderBackground}>

        <TouchableWithoutFeedback
          onPressIn={() => {
            this.animateInCircle(true)
          }}
          onPressOut={() => {
            this.animateInCircle(false)
          }}
        >
          <Animated.View style={[styles.circle,this.transformForAnimation(this.circleAnimation)]} />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPressIn={() => {
            this.animateInRectangle(true)
          }}
          onPressOut={() => {
            this.animateInRectangle(false)
          }}
        >
          <Animated.View style={[styles.rectangle, this.transformForAnimation(this.rectangleAnimation)]} />
        </TouchableWithoutFeedback>

        <View style={styles.triangleContainer}>
          <TouchableWithoutFeedback
            onPressIn={() => {
              this.animateInTriangle(true)
            }}
            onPressOut={() => {
              this.animateInTriangle(false)
            }}
          >
            <Animated.View style={[styles.triangle,this.transformForAnimation(this.triangleAnimation)]} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  resetAnimationValues() {
    this.circleAnimation.setValue(1)
    this.rectangleAnimation.setValue(1)
    this.triangleAnimation.setValue(1)
  }

  updateUIStates(props: Object) {
    const { resetShapes } = props
    if(resetShapes) {
      this.resetAnimationValues()
      console.log(`HUNG resetShapes ${resetShapes}`)
    }
  }

  animateInCircle(flag) {
    var toValue = flag ? maxScale : 1

    if(flag) {
      circleTapCount = circleTapCount + 1
    } else {
      if(circleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    this.animateIn(this.circleAnimation, toValue, flag)
  }

  animateInRectangle(flag: bool) {
    var toValue = flag ? maxScale : 1

    if(flag) {
      rectangleTapCount = rectangleTapCount + 1
    } else {
      if(rectangleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    this.animateIn(this.rectangleAnimation, toValue, flag)
  }

  animateInTriangle(flag: bool) {
    var toValue = flag ? maxScale : 1

    if(flag) {
      triangleTapCount = triangleTapCount + 1
    } else {
      if(triangleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    this.animateIn(this.triangleAnimation, toValue, flag)
  }

  animateIn(animation, toValue: number, flag: bool) {
    Animated.spring(
      animation,
      {
        toValue: toValue,
        speed: 12,
        bounciness: 10,
      }
    ).start()
  }

  transformForAnimation(animation) {
    const transform = {
      transform: [{
        scaleX: animation.interpolate({
          inputRange: [0, maxScale],
          outputRange: [0, maxScale]
        })},
        {
        scaleY: animation.interpolate({
          inputRange: [0, maxScale],
          outputRange: [0, maxScale]
        })
      }]
    }
    return transform
  }

}

SREmptyStateHeader.propTypes = {
  resetShapes: PropTypes.bool,
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

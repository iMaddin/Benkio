// @flow
import React, { Component } from 'react'
import { Animated, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import PropTypes from 'prop-types';

import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from '../../utilities/SRColors'

const tapsUntilDisappearance = 5
const maxScale = 1.5

var circleTapCount = 0
var rectangleTapCount = 0
var triangleTapCount = 0

var circleAnimation = new Animated.Value(1)
var rectangleAnimation = new Animated.Value(1)
var triangleAnimation = new Animated.Value(1)

var headerIsEmpty = false

export default class SREmptyStateHeader extends Component {

  state = {
    disableCircleButton: false,
    disableRectangleButton: false,
    disableTriangleButton: false,
  }

  constructor(props) {
    super(props)
    const { animateInShapes } = this.props

    if(animateInShapes) {
      this.setAnimationValues(0)
    }
  }

  componentWillMount() {
    const { animateInShapes } = this.props

  }

  componentDidMount() {
    const { animateInShapes } = this.props
    if(animateInShapes) {
      this.animateInAllShapes()
    }
  }

  componentWillReceiveProps(newProps: Object) {
    const { animateInShapes, resetShapesWhenEmpty } = newProps

    if(animateInShapes) {
      this.setAnimationValues(0)
      this.animateInAllShapes()
    }

    if(headerIsEmpty && resetShapesWhenEmpty) {
      this.animateInAllShapes()
    }

  }

  render() {
    return (
      <View style={styles.emptyStateHeaderBackground}>

        <TouchableWithoutFeedback
          disabled={this.state.disableCircleButton}
          onPressIn={() => {
            this.animateInCircle(true)
          }}
          onPressOut={() => {
            this.animateInCircle(false)
          }}
        >
          <Animated.View style={[styles.circle, this.transformForAnimation(circleAnimation)]} />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          disabled={this.state.disableRectangleButton}
          onPressIn={() => {
            this.animateInRectangle(true)
          }}
          onPressOut={() => {
            this.animateInRectangle(false)
          }}
        >
          <Animated.View style={[styles.rectangle, this.transformForAnimation(rectangleAnimation)]} />
        </TouchableWithoutFeedback>

        <View style={styles.triangleContainer}>
          <TouchableWithoutFeedback
            disabled={this.state.disableTriangleButton}
            onPressIn={() => {
              this.animateInTriangle(true)
            }}
            onPressOut={() => {
              this.animateInTriangle(false)
            }}
          >
            <Animated.View style={[styles.triangle, this.transformForAnimation(triangleAnimation)]} />
          </TouchableWithoutFeedback>
        </View>
      </View>
    )
  }

  setAnimationValues(value) {
    circleAnimation.setValue(value)
    rectangleAnimation.setValue(value)
    triangleAnimation.setValue(value)
  }

  animateInCircle(flag) {
    var toValue = flag ? maxScale : 1

    if(flag) {
      circleTapCount = circleTapCount + 1
      if(circleTapCount >= tapsUntilDisappearance) {
        if(!this.state.disableCircleButton) {
          this.setState({disableCircleButton: true})
        }
        return
      }
    } else {
      if(circleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    this.animateIn(circleAnimation, toValue).start(() => {
      if(this.state.disableCircleButton && !flag) {
        this.animateAllShapesIfEmpty()
      }
    })
  }

  animateInRectangle(flag: bool) {
    var toValue = flag ? maxScale : 1

    if(flag) {
      rectangleTapCount = rectangleTapCount + 1
      if(rectangleTapCount >= tapsUntilDisappearance) {
        if(!this.state.disableRectangleButton) {
          this.setState({disableRectangleButton: true})
        }
        return
      }
    } else {
      if(rectangleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    this.animateIn(rectangleAnimation, toValue).start(() => {
      if(this.state.disableRectangleButton && !flag) {
        this.animateAllShapesIfEmpty()
      }
    })
  }

  animateInTriangle(flag: bool) {
    var toValue = flag ? maxScale : 1

    if(flag) {
      triangleTapCount = triangleTapCount + 1
      if(triangleTapCount >= tapsUntilDisappearance) {
        if(!this.state.disableTriangleButton) {
          this.setState({disableTriangleButton: true})
        }
        return
      }
    } else {
      if(triangleTapCount >= tapsUntilDisappearance) {
        toValue = 0
      }
    }

    this.animateIn(triangleAnimation, toValue).start(() => {
      if(this.state.disableTriangleButton && !flag) {
        this.animateAllShapesIfEmpty()
      }
    })
  }

  animateIn(animation, toValue: number) {
    return Animated.spring(
      animation,
      {
        toValue: toValue,
        speed: 12,
        bounciness: 10,
      }
    )
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

  animateAllShapesIfEmpty() {
    const { resetShapesWhenEmpty } = this.props

    if(circleTapCount >= tapsUntilDisappearance && rectangleTapCount >= tapsUntilDisappearance && triangleTapCount >= tapsUntilDisappearance) {
      circleTapCount = 0
      rectangleTapCount = 0
      triangleTapCount = 0

      if (resetShapesWhenEmpty) {
        headerIsEmpty = false
        this.animateInAllShapes(() => {
          this.setState({
            disableCircleButton: false,
            disableRectangleButton: false,
            disableTriangleButton: false,
          })
        })
      } else {
        headerIsEmpty = true
        this.setState({
          disableCircleButton: false,
          disableRectangleButton: false,
          disableTriangleButton: false,
        })
      }
    }
  }

  animateInAllShapes(completion?: () => void) {
    const toValue = 1
    Animated.stagger(300, [
      Animated.delay(1500),
      this.animateIn(circleAnimation, toValue), // if circle is last shape to animate out, this will fail
      this.animateIn(triangleAnimation, toValue),
      this.animateIn(rectangleAnimation, toValue),
    ]).start(() => {
      if(completion != null) {
          completion()
      }
    })
  }

}

SREmptyStateHeader.propTypes = {
  resetShapesWhenEmpty: PropTypes.bool,
  animateInShapes: PropTypes.bool
}

SREmptyStateHeader.defaultProps = {
  resetShapesWhenEmpty: true,
  animateInShapes: false
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
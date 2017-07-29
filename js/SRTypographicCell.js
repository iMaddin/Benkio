// @flow
import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from 'react-native'
import {SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor} from './utilities/SRColors'

var leftPopAnimation = new Animated.Value(1)
var centerPopAnimation = new Animated.Value(1)
var rightPopAnimation = new Animated.Value(1)

var leftYpositionAnimation = new Animated.Value(0)
var centerYpositionAnimation = new Animated.Value(0)
var rightYpositionAnimation = new Animated.Value(0)

const leftButtonAnimatedStyles = [leftPopAnimation, leftYpositionAnimation]
const centerButtonAnimatedStyles = [centerPopAnimation, centerYpositionAnimation]
const rightButtonAnimatedStyles = [rightPopAnimation, rightYpositionAnimation]
const animationStyles = [leftButtonAnimatedStyles, centerButtonAnimatedStyles, rightButtonAnimatedStyles]

const intervalBetweenAnimations = 2000
var buttonLastAnimated = Math.floor((Math.random() * 3) + 0)
var nextButtonToAnimate = buttonLastAnimated

const maxScale = 1.5
const popToValue = 1.2
const popFromValue = 1
const popSpeed = 16
const popBounciness = 18

const yToValue = -4
const yFromValue = 0

const yVelocity = -0.1
const yDeceleration = 0.997

const ySpeed = 16
const yBounciness = 18

export default class SRTypographicCell extends React.Component {

  componentDidMount() {
    const { animateRatingButton } = this.props
    if(animateRatingButton) {
      this.startAnimatingRatingButtons()
    }
  }

  render() {
    const { children, onPressDetailsButton, onPressRateButton } = this.props
    const date = children.date.toUpperCase()
    console.log(`SRTypographicCell ...this.animationsForButton(0) ${JSON.stringify(this.animationsForButton(0))}`)
    return (
      <View style={styles.cell}>
        <TouchableHighlight
          style={styles.cellButton}
          underlayColor={'rgba(0, 0, 0, 0.04)'}
          onPress={onPressDetailsButton}>

          <View style={styles.cellData}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.title}>{children.title}</Text>
            {this._renderNotes(children.notes != null && children.notes != '')}

            <View style={styles.touchableContainer}>
              <TouchableHighlight
                style={styles.ratingButton}
                underlayColor={'rgba(0, 0, 0, 0.06)'}
                onPress={onPressRateButton}>

                <View style={styles.buttonContainer}>
                  <Animated.View style={[styles.buttonComponent, this.animationsForButton(0)]} />
                  <Animated.View style={[styles.buttonComponent, this.animationsForButton(1)]} />
                  <Animated.View style={[styles.buttonComponent, this.animationsForButton(2)]} />
                </View>

              </TouchableHighlight>
            </View>

          </View>
        </TouchableHighlight>
      </View>
    )
  }

  _renderNotes = (flag) => {
    if(flag) {
      return (
        <Text style={styles.notes}>{this.props.children.notes}</Text>
      )
    } else {
      return null
    }
  }

  startAnimatingRatingButtons() {
    console.log(`SRTypographicCell startAnimatingRatingButtons()`)
    // Restart selection
    while(nextButtonToAnimate == buttonLastAnimated) {
      nextButtonToAnimate = Math.floor((Math.random() * 3) + 0)
    }
    buttonLastAnimated = nextButtonToAnimate

    const nextAnimatioStyles = animationStyles[nextButtonToAnimate]

    this.popAnimationSequence(nextAnimatioStyles[0],nextAnimatioStyles[1]).start(()=>{
      this.startAnimatingRatingButtons()
    })
  }

  popAnimationSequence(springAnimation, yTranslateAnimation) {
    return Animated.sequence([
      Animated.parallel([
        Animated.spring(
          springAnimation,
          {
            toValue: popToValue,
            speed: popSpeed,
            bounciness: popBounciness,
          }
        ),
        Animated.decay(
          yTranslateAnimation,
          {
            // toValue: yToValue,
            velocity: yVelocity,
            deceleration: yDeceleration,
          }
        )
      ]),
      Animated.parallel([
        Animated.spring(
          springAnimation,
          {
            toValue: popFromValue,
            speed: popSpeed,
            bounciness: popBounciness,
          }
        ),
        Animated.decay(
          yTranslateAnimation,
          {
            // toValue: yToValue,
            velocity: -yVelocity,
            deceleration: yDeceleration,
          }
        )
        // Animated.spring(
        //   yTranslateAnimation,
        //   {
        //     toValue: yFromValue,
        //     speed: ySpeed,
        //     bounciness: yBounciness,
        //   }
        // )
      ]),
    ])
  }

  animationsForButton(index: number) {
    const style = animationStyles[index]
    return { transform: [
      ...this.scaleXYForAnimation(style[0]),
      this.yPositionForAnimation(style[1])
    ]}
  }

  scaleXYForAnimation(animation) {
    const transform = [
      {
      scaleX: animation.interpolate({
        inputRange: [0, maxScale],
        outputRange: [0, maxScale]
      })},
      {
      scaleY: animation.interpolate({
        inputRange: [0, maxScale],
        outputRange: [0, maxScale]
      })}
    ]
    return transform
  }

  yPositionForAnimation(animation) {
    return {
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1]
    })}
  }

}

SRTypographicCell.defaultProps = {
  animateRatingButton: true,
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: SRDarkColor,
    marginBottom:10,
  },
  cellButton: {
    flex: 1,
  },
  cellData: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 20,
    paddingBottom: 20,
  },
  date: {
    color: SRRedColor,
    fontSize: 36,
    fontWeight: '500',
    // textDecorationLine: 'underline'
  },
  title: {
    color: SRBrightColor,
    fontSize: 48,
    fontWeight: '500',
    paddingTop: 20,
  },
  notes: {
    color: SRBrightColor,
    fontSize: 36,
    fontWeight: '300',
    paddingTop: 20,
  },
  touchableContainer: {
    flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingButton: {
    flexShrink: 1,
    width:  44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  buttonComponent: {
    backgroundColor: SRYellowColor,
    borderRadius: 2,
    width: 10,
    height: 16,
    margin: 2,
  }
})

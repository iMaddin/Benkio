// @flow
import React from 'react'
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { SRColor } from '../../utilities/SRColor'

// Animation Settings

const maxScale = 1.5
const minScale = 0.5

const scaleYToValue = 1.2
const scaleYFromValue = 1

const scaleXToValue = 0.8
const scaleXFromValue = 1

const yToValue = -5
const yFromValue = 0

const timingDuration = 350

const translateYEasingIn = Easing.back(2)
const scaleXEasingIn = Easing.back(4)
const scaleYEasingIn = Easing.back(4)

const easingEnd = Easing.elastic(2)
const translateYEasingOut = easingEnd
const scaleXEasingOut = easingEnd
const scaleYEasingOut = easingEnd

export default class SRTypographicCell extends React.Component {

  // X Scale
  leftXScaleAnimation = new Animated.Value(1)
  centerXScaleAnimation = new Animated.Value(1)
  rightXScaleAnimation = new Animated.Value(1)

  // Y Scale
  leftYScaleAnimation = new Animated.Value(1)
  centerYScaleAnimation = new Animated.Value(1)
  rightYScaleAnimation = new Animated.Value(1)

  // Y Translation
  leftYpositionAnimation = new Animated.Value(0)
  centerYpositionAnimation = new Animated.Value(0)
  rightYpositionAnimation = new Animated.Value(0)

  // Animated values grouped for views
  leftButtonAnimatedStyles = [this.leftXScaleAnimation, this.leftYScaleAnimation, this.leftYpositionAnimation]
  centerButtonAnimatedStyles = [this.centerXScaleAnimation, this.centerYScaleAnimation, this.centerYpositionAnimation]
  rightButtonAnimatedStyles = [this.rightXScaleAnimation, this.rightYScaleAnimation, this.rightYpositionAnimation]
  animationStyles = [this.leftButtonAnimatedStyles, this.centerButtonAnimatedStyles, this.rightButtonAnimatedStyles]

  buttonLastAnimated = Math.floor((Math.random() * 3) + 0)
  nextButtonToAnimate = this.buttonLastAnimated

  componentDidMount() {
    const { animateRatingButton } = this.props
    if(animateRatingButton) {
      this.startAnimatingRatingButtons()
    }
  }

  render() {
    const { children, onPressDetailsButton, onPressRateButton } = this.props
    const date = children.date.toUpperCase()

    return (
      <View style={styles.cell}>
        <TouchableOpacity
          style={styles.cellButton}
          onPress={onPressDetailsButton}>

          <View style={styles.cellData}>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.title}>{children.title}</Text>
            {this._renderNotes(children.notes != null && children.notes != '')}

            <View style={styles.touchableContainer}>
              <TouchableOpacity
                style={styles.ratingButton}
                onPress={onPressRateButton}>

                <View style={styles.buttonContainer}>
                  <Animated.View style={[styles.buttonComponent, this.animationsForButton(0)]} />
                  <Animated.View style={[styles.buttonComponent, this.animationsForButton(1)]} />
                  <Animated.View style={[styles.buttonComponent, this.animationsForButton(2)]} />
                </View>

              </TouchableOpacity>
            </View>

          </View>
        </TouchableOpacity>
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
    // Restart selection
    while(this.nextButtonToAnimate == this.buttonLastAnimated) {
      this.nextButtonToAnimate = Math.floor((Math.random() * 3) + 0)
    }
    this.buttonLastAnimated = this.nextButtonToAnimate

    const nextAnimationStyles = this.animationStyles[this.nextButtonToAnimate]

    Animated.sequence([
      this.animateValues(nextAnimationStyles[0], nextAnimationStyles[1], nextAnimationStyles[2]),
      Animated.delay(this.props.intervalBetweenAnimations)
    ]).start(()=>{
      this.startAnimatingRatingButtons()
    })
  }

  animateValues(scaleXAnimation, scaleYAnimation, yTranslateAnimation) {
    return Animated.sequence([
      Animated.parallel([
        Animated.timing(
          scaleXAnimation,
          {
            toValue: scaleXToValue,
            easing: scaleXEasingIn,
            duration: timingDuration,
          }
        ),
        Animated.timing(
          scaleYAnimation,
          {
            toValue: scaleYToValue,
            easing: scaleYEasingIn,
            duration: timingDuration,
          }
        ),
        Animated.timing(
          yTranslateAnimation,
          {
            toValue: yToValue,
            easing: translateYEasingIn,
            duration: timingDuration,
          }
        )
      ]),
      Animated.parallel([
        Animated.timing(
          scaleXAnimation,
          {
            toValue: scaleXFromValue,
            easing: scaleXEasingOut,
            duration: timingDuration,
          }
        ),
        Animated.timing(
          scaleYAnimation,
          {
            toValue: scaleYFromValue,
            easing: scaleYEasingOut,
            duration: timingDuration,
          }
        ),
        Animated.timing(
          yTranslateAnimation,
          {
            toValue: yFromValue,
            easing: translateYEasingOut,
            duration: timingDuration,
          }
        )
      ]),
    ])
  }

  animationsForButton(index: number) {
    const style = this.animationStyles[index]
    return { transform: [
      this.scaleXForAnimation(style[0]),
      this.scaleYForAnimation(style[1]),
      this.yPositionForAnimation(style[2])
    ]}
  }

  scaleXForAnimation(animation) {
    const transform =
      {
      scaleX: animation.interpolate({
        inputRange: [0, maxScale],
        outputRange: [0, maxScale]
      })}
    return transform
  }

  scaleYForAnimation(animation) {
    const transform =
      {
      scaleY: animation.interpolate({
        inputRange: [0, maxScale],
        outputRange: [0, maxScale]
      })}
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
  intervalBetweenAnimations: 1500,
}

const styles = StyleSheet.create({
  cell: {
    backgroundColor: SRColor.DarkColor,
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
    color: SRColor.RedColor,
    fontSize: 36,
    fontWeight: '500',
    // textDecorationLine: 'underline'
  },
  title: {
    color: SRColor.BrightColor,
    fontSize: 48,
    fontWeight: '500',
    paddingTop: 20,
  },
  notes: {
    color: SRColor.BrightColor,
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
    backgroundColor: SRColor.YellowColor,
    borderRadius: 2,
    width: 10,
    height: 16,
    margin: 2,
  }
})

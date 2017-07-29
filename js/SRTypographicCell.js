// @flow
import React from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from 'react-native'
import {SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor} from './utilities/SRColors'

var leftButtonAnimation = new Animated.Value(1)
var centerButtonAnimation = new Animated.Value(1)
var rightButtonAnimation = new Animated.Value(1)

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
                  <Animated.View style={[styles.buttonComponent, this.transformForAnimation(leftButtonAnimation)]} />
                  <Animated.View style={[styles.buttonComponent, this.transformForAnimation(centerButtonAnimation)]} />
                  <Animated.View style={[styles.buttonComponent, this.transformForAnimation(rightButtonAnimation)]} />
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
    const intervalBetweenAnimations = 2000

    var buttonLastAnimated = 0

    const buttonToAnimateNext = 0
    buttonLastAnimated = buttonToAnimateNext
    const animations = [leftButtonAnimation, centerButtonAnimation, rightButtonAnimation]
    const buttonToAnimate = animations[buttonToAnimateNext]
    // buttonToAnimate.start()

    Animated.loop(
      Animated.sequence([
        Animated.spring(
          buttonToAnimate,
          {
            toValue: 1.5
          }
        ),
        Animated.spring(
          buttonToAnimate,
          {
            toValue: 1
          }
        )
      ])
    ).start()
  }

  transformForAnimation(animation) {
    const maxScale = 1.5
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

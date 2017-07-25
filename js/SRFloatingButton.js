// @flow
import React from 'react'
import {
  Animated,
  Easing,
  TouchableOpacity,
  View
} from 'react-native'

export default class SRFloatingButton extends React.Component {

  // constructor(props){
  //   super(props)
  // }

  state = {
    bounceAnimation: new Animated.Value(0),
    spinAnimation: new Animated.Value(0),
    springAnimation: new Animated.Value(0),
  }

  componentWillReceiveProps() {
    const { keepBouncing, keepSpinning, keepSpringing } = this.props
    const { bounceAnimation, spinAnimation, springAnimation } = this.state

    const spinning = Animated.loop(
      Animated.timing(
        spinAnimation,
        {
          toValue: 1,
          easing: Easing.linear,
          duration: 6000,
          // useNativeDriver: true,
        }
      )
    )

    if(keepSpinning) {
      spinning.start()
    } else {
      spinAnimation.setValue(0)
    }
  }

  render() {
    const { children, style, onPress } = this.props
    const { bounceAnimation, spinAnimation, springAnimation } = this.state

    return(
      <Animated.View
        style={{
          transform: [{
            rotate: spinAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            })
          ,}]
        }}
      >
        <TouchableOpacity
          style={style}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </Animated.View>

    )
  }
}

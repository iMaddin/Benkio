// @flow
import React from 'react'
import {
  Animated,
  Easing,
  TouchableOpacity,
  View
} from 'react-native'

export default class SRFloatingButton extends React.Component {

  state = {
    bounceAnimation: new Animated.Value(0),
    spinAnimation: new Animated.Value(0),
    springAnimation: new Animated.Value(0),
  }

  componentWillMount() {
    this.updateUIStates(this.props)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
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

  updateUIStates = (props: Object) => {
    const { keepBouncing, keepSpinning, keepSpringing } = props
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
}

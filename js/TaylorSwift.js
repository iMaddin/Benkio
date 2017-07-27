// @flow
import React, { Component } from 'react'
import {
  Alert,
  Animated,
  Modal,
  StyleSheet,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation'
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'

import SRHome from './SRHome'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRFloatingButton from './SRFloatingButton'
import SRDiamond from './components/geometry/SRDiamond'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'

const SpaceReminder = StackNavigator({
  Home: { screen: withMappedNavigationAndConfigProps(SRHome) },
  StudyTaskDetails: { screen: withMappedNavigationAndConfigProps(SRStudyTaskEditor)},
})

const AddStudyTaskNavigator = StackNavigator({
  AddStudyTask: { screen: withMappedNavigationAndConfigProps(SRStudyTaskEditor) }
})

const minScale = 0.9

class TaylorSwift extends Component {

  state: {
    addTaskModalisVisible: bool,
    keepSpinning: bool,
    scaleAnimation: Animated.Value,
    isTransformed: bool
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      addTaskModalisVisible: false,
      keepSpinning: false,
      scaleAnimation: new Animated.Value(1),
      isTransformed: false,
    }
  }

  componentWillMount() {
    this.updateUIStates(this.props)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {

    const {
      addTaskModalisVisible,
      keepSpinning,
      scaleAnimation,
      isTransformed
    } = this.state

    const addTaskScreenProps = {
      readonly: false,
      saveAction: (item) => {
        // this.addTask(item)
        this.setAddTaskModalVisible(!addTaskModalisVisible)
      },
      cancelAction: () => this.setAddTaskModalVisible(!addTaskModalisVisible),
    }

    return (
      <View style={styles.rootView}>

        <Animated.View style={{
          flex: 1,
          transform: [
          {
            scaleX: scaleAnimation.interpolate({
              inputRange: [minScale, 1],
              outputRange: [minScale, 1]
            }),
          },
          {
            scaleY: scaleAnimation.interpolate({
              inputRange: [minScale, 1],
              outputRange: [minScale, 1]
            }),
          }
        ]
        }}>
          <SpaceReminder />
        </Animated.View>

        <View style={styles.floatingButton}>
          <SRFloatingButton
            keepSpinning={keepSpinning}
            style={styles.addTouchable}
            // onPress={()=>this.setAddTaskModalVisible(!addTaskModalisVisible)}
            onPress={()=>this.transformAnimate(!isTransformed)}

            >

            <SRDiamond style={styles.floatingButtonContent} sideLength={14} backgroundColor={SRYellowColor} />

          </SRFloatingButton>
        </View>

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={addTaskModalisVisible}
          >
         <AddStudyTaskNavigator screenProps={addTaskScreenProps}/>
        </Modal>

      </View>

    )
  }

  updateUIStates = (props: Object) => {
    const { studyTasks } = props
    this.setState({keepSpinning: (studyTasks.length == 0)})
  }

  // Modals

  setAddTaskModalVisible(visible: bool) {
    this.setState({addTaskModalisVisible: visible})
  }

  transformAnimate = (flag: bool) => {
    const { scaleAnimation } = this.state

    const animation = Animated.spring(
      scaleAnimation,
      {
        toValue: flag ? minScale : 1.0,
        bounciness: 8,
        speed: 14,
      }
    )
    this.setState({isTransformed: flag})
    animation.start()
  }

}

const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

export default connect(mapStateToProps)(TaylorSwift)

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'black',
  },
  floatingButton: {
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  addTouchable: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(57, 62, 65, 0.9)',
  },
  floatingButtonContent: {
  },
})

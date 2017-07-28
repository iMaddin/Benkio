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
import { mapDispatchToProps, mapStateToProps } from './dataModel/SRDataManipulator'

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
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      addTaskModalisVisible: false,
      keepSpinning: false,
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
    } = this.state

    const addTaskScreenProps = {
      readonly: false,
      saveAction: (item) => {
        this.props.addItem(item)
        this.setAddTaskModalVisible(!addTaskModalisVisible)
      },
      cancelAction: () => {
        this.setAddTaskModalVisible(!addTaskModalisVisible)
      },
    }

    return (
      <View style={styles.rootView}>

        <View style={{flex: 1}}>
          <SpaceReminder />
        </View>

        <View style={styles.floatingButtonContainer}>
          <SRFloatingButton
            keepSpinning={keepSpinning}
            style={styles.floatingButton}
            onPress={()=>this.setAddTaskModalVisible(!addTaskModalisVisible)}
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

}

export default connect(mapStateToProps, mapDispatchToProps)(TaylorSwift)

const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'black',
  },
  floatingButtonContainer: {
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  floatingButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(57, 62, 65, 0.9)',
    borderWidth: 1,
    borderColor: SRBrightColor,
  },
  floatingButtonContent: {
  },
})

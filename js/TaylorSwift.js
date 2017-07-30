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

import SRHome from './components/screens/SRHome'
import SRStudyTaskEditor from './components/screens/SRStudyTaskEditor'
import { SRColor } from './utilities/SRColor'
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
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      addTaskModalisVisible: false,
    }
  }

  render() {
    const { addTaskModalisVisible } = this.state

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
          <SpaceReminder screenProps={{toggleAddTaskScreen: () => this.setAddTaskModalVisible(!addTaskModalisVisible)}}/>
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
})

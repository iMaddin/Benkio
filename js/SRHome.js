// @flow
import React, { Component } from 'react'
import { Modal, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { withMappedNavigationProps, withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'
import {connect} from 'react-redux'

import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'

export const AddStudyTaskScreenName = 'AddStudyTask'

const AddStudyTaskNavigator = StackNavigator({
  AddStudyTask: { screen: withMappedNavigationProps(SRStudyTaskEditor) }
})

export class SRHome extends Component {

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
        // this.addTask(item)
        this.setAddTaskModalVisible(!addTaskModalisVisible)
      },
      cancelAction: () => this.setAddTaskModalVisible(!addTaskModalisVisible),
    }

    return (
      <View style={{flex:1}}>

        <SRStudyList />

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

const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

export default connect(mapStateToProps)(SRHome)

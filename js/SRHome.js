// @flow
import React, { Component } from 'react'
import { Modal, StyleSheet, View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { withMappedNavigationProps, withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'
import {connect} from 'react-redux'

import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRFloatingButton from './SRFloatingButton'
import SRDiamond from './components/geometry/SRDiamond'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'


export const AddStudyTaskScreenName = 'AddStudyTask'

const AddStudyTaskNavigator = StackNavigator({
  AddStudyTask: { screen: withMappedNavigationProps(SRStudyTaskEditor) }
})

export class SRHome extends Component {

  state: {
    addTaskModalisVisible: bool,
    keepSpinning: bool,
  }

  constructor(props: Object) {
    super(props)
    this.state = {
      addTaskModalisVisible: false,
      keepSpinning: false,
    }
  }

  render() {
    const {
      addTaskModalisVisible,
      keepSpinning,
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
      <View style={{flex:1}}>

        <SRStudyList
          // action={this.setAddTaskModalVisible(!addTaskModalisVisible)}
        />

        <View style={styles.floatingButton}>
          <SRFloatingButton
            keepSpinning={keepSpinning}
            style={styles.addTouchable}
            onPress={()=>{
            action()
          }}>

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

const styles = StyleSheet.create({
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

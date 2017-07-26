// @flow
import React, { Component } from 'react'
import {
  Alert,
  Modal,
  StyleSheet,
  View } from 'react-native'
import { NavigationActions, StackNavigator } from 'react-navigation'
import { withMappedNavigationProps, withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'
import { connect } from 'react-redux'
import expect from 'expect'

import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRFloatingButton from './SRFloatingButton'
import SRDiamond from './components/geometry/SRDiamond'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'
import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import uuid from './utilities/UUID'
import SRSpacedRepetition from './SRSpacedRepetition'

export const StudyTaskDetailsScreenName = 'StudyTaskDetails'

const AddStudyTaskNavigator = StackNavigator({
  AddStudyTask: { screen: withMappedNavigationProps(SRStudyTaskEditor) }
})

export class SRHome extends Component {

  static navigationOptions = (props) => {
    return {
      headerTintColor: SRDarkColor,
      headerStyle: { backgroundColor: SRBrightColor},
      title: 'CHANGE ME',
    }
  }

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
        this.addTask(item)
        this.setAddTaskModalVisible(!addTaskModalisVisible)
      },
      cancelAction: () => this.setAddTaskModalVisible(!addTaskModalisVisible),
    }

    return (
      <View style={{flex:1}}>

        <SRStudyList
          props={this.props.navigation}
          navigationAction ={ (item) => {
            const displayProps = {
              readonly: true,
              item: item,
              saveAction: (newItem, oldItem) => this.updateTask(newItem, oldItem),
              deleteAction: () => this.deleteTask(item),
            }
            this.props.navigation.navigate(StudyTaskDetailsScreenName, displayProps)
          }}
        />

        <View style={styles.floatingButton}>
          <SRFloatingButton
            keepSpinning={keepSpinning}
            style={styles.addTouchable}
            onPress={()=>this.setAddTaskModalVisible(!addTaskModalisVisible)}>

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

  // Model Manipulation

  addTask = (task: {taskName: string, notes: string, date: string}) => {
    const { addItem, dispatch } = this.props
    const {taskName, notes, date} = task

    const studyTask = new SRStudyTask(
      uuid(),
      taskName,
      notes,
      [date],
      [],
      SRStudyTaskIntensity.NORMAL,
      new SRSpacedRepetition(),
    )
    console.log(`task: ${JSON.stringify(task)}`)
    console.log(`studyTask ${JSON.stringify(studyTask)}`)
    addItem(studyTask)
  }

  updateTask = (newTask: {id: string, taskName: string, notes: string, date: string}, oldTask: {id: string, taskName: string, notes: string, date: string}) => {
    const { replaceItem } = this.props
    const mergedItem = this.dataWithID(oldTask.id)
    mergedItem.taskName = newTask.taskName
    mergedItem.notes = newTask.notes
    replaceItem(mergedItem)
  }

  deleteTask = (task: {id: string, taskName: string, notes: string, date: string}) => {
    const { navigation, removeItem } = this.props
    Alert.alert(
      'Delete Study Task',
      'Are you sure you want to delete the study task? This cannot be undone.',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Delete', onPress: () => {
          removeItem(task)
          navigation.dispatch(NavigationActions.back())
        }},
      ],
      { cancelable: true }
    )
  }

  dataWithID = (id: string) => {
    expect(id).toExist('dataWithID(): Undefined id')
    const { studyTasks } = this.props
    const filteredArray = studyTasks.filter((item) => item.id == id)
    expect(filteredArray.length).toBe(1, `Looking for data with id: ${id}. Item: ${JSON.stringify(studyTasks)}`)
    const item = filteredArray[0]
    return item
  }

}

const mapDispatchToProps = dispatch => {
  return {
    addItem: item => {
      dispatch(actionCreators.add(item))
    },
    removeItem: item => {
      dispatch(actionCreators.remove(item))
    },
    replaceItem: item => {
      dispatch(actionCreators.replace(item))
    }
  }
}

const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SRHome)

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

// @flow
import React, { Component } from 'react'
import { Alert, View } from 'react-native'
import { NavigationActions, StackNavigator } from 'react-navigation'
import { withMappedNavigationProps, withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'
import { connect } from 'react-redux'
import expect from 'expect'

import SRStudyList, { studyListTitle } from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'
import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import uuid from './utilities/UUID'
import SRSpacedRepetition from './SRSpacedRepetition'

export const StudyTaskDetailsScreenName = 'StudyTaskDetails'

class SRHome extends Component {

  static navigationOptions = (props) => {
    return {
      headerTintColor: SRDarkColor,
      headerStyle: { backgroundColor: SRBrightColor},
      title: studyListTitle,
    }
  }

  render() {
    return (
      <View style={{flex:1}}>

        <SRStudyList
          navigationAction ={item => this.navigateToItem(item)}
          rateAction = {(item, grade) => this.rateItem(item, grade)}
        />

       </View>
    )
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

  // SRStudyListCell

  navigateToItem = (item: {id: string, taskName: string, notes: string, date: string}) => {
    const displayProps = {
      readonly: true,
      item: item,
      saveAction: (newItem, oldItem) => this.updateTask(newItem, oldItem),
      deleteAction: () => this.deleteTask(item),
    }
    this.props.navigation.navigate(StudyTaskDetailsScreenName, displayProps)
  }

  rateItem = (id: string, grade: number) => {
    expect(id).toExist('rateItem(): undefined id')
    const item = this.dataWithID(id)

    // update SRS, rating history, date rated,
    item.ratingHistory.push(grade)

    const dateRated = new Date().toString()
    item.dates.push(dateRated)

    const { easinessFactor, interval, repetition } = item.srs
    const updatedSRS = new SRSpacedRepetition(easinessFactor, interval, repetition).grade(grade)
    item.srs = updatedSRS

    this.props.replaceItem(item)
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

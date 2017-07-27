// @flow
import React, { Component } from 'react'
import { Alert, View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import expect from 'expect'

import SRStudyList, { studyListTitle } from './SRStudyList'
import SRSpacedRepetition from './SRSpacedRepetition'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'
import { mapDispatchToProps, mapStateToProps } from './dataModel/SRDataManipulator'

export const StudyTaskDetailsScreenName = 'StudyTaskDetails'

class SRHome extends Component {

  static navigationOptions = (props) => {
    const { studyTasks } = props
    return {
      headerTintColor: SRDarkColor,
      headerStyle: { backgroundColor: SRBrightColor},
      title: (studyTasks == null || studyTasks.length == 0) ? ' ' : studyListTitle,
    }
  }

  render() {
    return (
      <View style={{flex:1}}>

        <SRStudyList
          navigationAction ={item => this.navigateToItem(item)}
          rateAction = {(item, grade) => this.rateTask(item, grade)}
        />

       </View>
    )
  }

  updateTask = (
    newTask: {id: string, taskName: string, notes: string, date: string},
    oldTask: {id: string, taskName: string, notes: string, date: string}) => {
    const { replaceItem, studyTasks } = this.props
    const mergedItem = this.dataWithID(oldTask.id, studyTasks)
    mergedItem.taskName = newTask.taskName
    mergedItem.notes = newTask.notes
    replaceItem(mergedItem)
  }

  rateTask = (id: string, grade: number) => {
    const { replaceItem, studyTasks } = this.props
    expect(id).toExist('rateItem(): undefined id')
    const item = this.dataWithID(id, studyTasks)

    // update SRS, rating history, date rated,
    item.ratingHistory.push(grade)

    const dateRated = new Date().toString()
    item.dates.push(dateRated)

    const { easinessFactor, interval, repetition } = item.srs
    const updatedSRS = new SRSpacedRepetition(easinessFactor, interval, repetition).grade(grade)
    item.srs = updatedSRS

    replaceItem(item)
  }

  dataWithID = (id: string, studyTasks: Array<Object>) => {
    expect(id).toExist('dataWithID(): Undefined id')
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

}

export default connect(mapStateToProps, mapDispatchToProps)(SRHome)

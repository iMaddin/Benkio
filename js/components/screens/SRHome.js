// @flow
import React, { Component } from 'react'
import { Alert, StyleSheet, View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import expect from 'expect'

import SRStudyList, { studyListTitle } from './SRStudyList'
import SRSpacedRepetition from '../../utilities/SRSpacedRepetition'
import SRFloatingButton from '../views/SRFloatingButton'
import SRDiamond from '../geometry/SRDiamond'
import { SRColor } from '../../utilities/SRColor'
import { mapDispatchToProps, mapStateToProps } from '../../dataModel/SRDataManipulator'

export const StudyTaskDetailsScreenName = 'StudyTaskDetails'

class SRHome extends Component {

  static navigationOptions = (props) => {
    const { title } = props
    return {
      headerTintColor: SRColor.DarkColor,
      headerStyle: { backgroundColor: SRColor.BrightColor},
      title: title,
    }
  }

  state = {
    keepSpinning: false,
  }

  componentWillMount() {
    this.updateUIStates(this.props)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {
    const { keepSpinning } = this.state
    const { toggleAddTaskScreen } = this.props

    return (
      <View style={{flex:1}}>

        <SRStudyList
          navigationAction ={item => this.navigateToItem(item)}
          rateAction = {(item, grade) => this.rateTask(item, grade)}
        />

        <View style={styles.floatingButtonContainer}>
          <SRFloatingButton
            keepSpinning={keepSpinning}
            style={styles.floatingButton}
            onPress={toggleAddTaskScreen}
            >
            <SRDiamond sideLength={14} backgroundColor={SRColor.YellowColor} />
          </SRFloatingButton>
        </View>

       </View>
    )
  }

  updateUIStates = (props) => {
    const { navigation, studyTasks } = props
    const title = (studyTasks == null || studyTasks.length == 0) ? ' ' : studyListTitle // leave whitespace title, otherwise react navigation bug will cause error
    if(props.title !== title) {
      navigation.setParams({ title: title }) // will cause another update cycle
    }

    this.setState({keepSpinning: (studyTasks.length == 0)})
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

const styles = StyleSheet.create({
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
  },
})

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
          rateAction = {(item, grade) => this.props.rateItem(item, grade)}
        />

       </View>
    )
  }

  // SRStudyListCell

  navigateToItem = (item: {id: string, taskName: string, notes: string, date: string}) => {
    const displayProps = {
      readonly: true,
      item: item,
      saveAction: (newItem, oldItem) => this.props.replaceItem(newItem, oldItem),
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

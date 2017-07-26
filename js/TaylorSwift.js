// @flow
import React, { Component } from 'react'
// import { View } from 'react-native'
import { StackNavigator } from 'react-navigation'
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'

import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRSettings from './SRSettings'

const SpaceReminder = StackNavigator({
  StudyList: { screen: SRStudyList },
  SRStudyTaskEditor: { screen: withMappedNavigationAndConfigProps(SRStudyTaskEditor)},
  }
)

const SettingsStackNavigator = StackNavigator({
  Settings: { screen: SRSettings },
  },{
  mode: 'modal',
  }
)

export default class TaylorSwift extends Component {

  render() {
    return (
      <SpaceReminder />
    )
  }

}

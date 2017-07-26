// @flow
import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'

import { SRHome } from './SRHome'
import SRStudyTaskEditor from './SRStudyTaskEditor'

const SpaceReminder = StackNavigator({
  Home: { screen: withMappedNavigationAndConfigProps(SRHome) },
  StudyTaskDetails: { screen: withMappedNavigationAndConfigProps(SRStudyTaskEditor)},
})

export default class TaylorSwift extends Component {

  render() {
    return (
      <SpaceReminder />
    )
  }

}

// @flow
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation'
import { withMappedNavigationAndConfigProps } from 'react-navigation-props-mapper'

import { SRHome } from './SRHome'
import SRStudyTaskEditor from './SRStudyTaskEditor'

const SpaceReminder = StackNavigator({
  Home: { screen: withMappedNavigationAndConfigProps(SRHome) },
  StudyTaskDetails: { screen: withMappedNavigationAndConfigProps(SRStudyTaskEditor)},
})

export class TaylorSwift extends Component {

  render() {
    return (
      <SpaceReminder screenProps={this.props}/>
    )
  }

}

export default connect()(TaylorSwift)

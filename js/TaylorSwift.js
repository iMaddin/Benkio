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

  // screenProps={this.props}
  // Provider can forward props to TaylorSwift but
  // need to forward props to navigator because react-redux provider doesn't seem to be able to do it
  // Since we are using withMappedNavigationAndConfigProps, the props will be available in children.
  render() {
    return (
      <SpaceReminder screenProps={this.props}/>
    )
  }

}

export default connect()(TaylorSwift)

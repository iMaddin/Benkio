// @flow

import React from 'react'
import { AppRegistry } from 'react-native'

import { StackNavigator, TabNavigator } from 'react-navigation'
import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRSettings from './SRSettings'

import { reducer } from './dataModel/SRSimpleDataModel'
import { createStore } from 'redux'
import PropTypes from 'prop-types'
import { tintColor } from './SRSettings'

const SettingsStackNavigator = StackNavigator({
  Settings: { screen: SRSettings },
  },{
  mode: 'modal',
  }
)

const SpaceReminder = StackNavigator({
  StudyList: { screen: SRStudyList },
  SRStudyTaskEditor: { screen: SRStudyTaskEditor},
  }
)

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    }
  }
  render() {
    return this.props.children
  }
}

Provider.childContextTypes = {
  store: PropTypes.object
}

class TaylorSwift extends React.Component {
  render() {
    const { store } = this.context

    const screenProps = {
      store: store,
    }

    return (
      <SpaceReminder screenProps={screenProps}/>
    )
  }
}

TaylorSwift.contextTypes = {
  store: PropTypes.object
}

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <TaylorSwift />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('SpaceReminder', () => App)

// @flow

import React from 'react'
import { AppRegistry, AsyncStorage, Text } from 'react-native'
import { StackNavigator, TabNavigator } from 'react-navigation'
import { createStore } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'

import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRSettings from './SRSettings'
import { reducer } from './dataModel/SRSimpleDataModel'

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

const store = createStore(reducer, undefined, autoRehydrate())

export default class App extends React.Component {

  state: {
    rehydrated: bool,
  }

  constructor() {
    super()
    this.state = { rehydrated: false }
  }

  componentWillMount() {
    persistStore(store, {storage: AsyncStorage}, () => {
      this.setState({ rehydrated: true })
    })
    // persistStore(store, {storage: AsyncStorage}).purge()
  }

  render() {
    if(!this.state.rehydrated){
      return <Text>Loading...</Text> // TODO: maybe not needed since react redux updates props anyway
    }
    return (
      <Provider store={store}>
        <SpaceReminder />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('SpaceReminder', () => App)

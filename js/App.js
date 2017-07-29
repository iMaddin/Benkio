// @flow
import React from 'react'
import { AppRegistry, AsyncStorage, Text } from 'react-native'
import { createStore } from 'redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import { Provider } from 'react-redux'

import TaylorSwift from './TaylorSwift'
import { reducer } from './dataModel/SRSimpleDataModel'

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
    return (
      <Provider store={store}>
        <TaylorSwift />
      </Provider>
    )
  }
}

AppRegistry.registerComponent('SpaceReminder', () => App)

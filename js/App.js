// @flow

import React from 'react'
import { AppRegistry } from 'react-native'

import { StackNavigator } from 'react-navigation'
import SRStudyList from './SRStudyList'

import { reducer } from './dataModel/SRSimpleDataModel'
import { createStore } from 'redux'

// create Redux store with reducer
const store = createStore(reducer)

// pass store to SRStudyList
const SRStudyListWithStore = () => <SRStudyList store={store} />

const SpaceReminder = StackNavigator({
  StudyList: { screen: SRStudyListWithStore },
});

AppRegistry.registerComponent('SpaceReminder', () => SpaceReminder);

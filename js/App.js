// @flow

import React from 'react'
import { AppRegistry } from 'react-native'

import { TabNavigator } from 'react-navigation'
import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'

import { reducer } from './dataModel/SRSimpleDataModel'
import { createStore } from 'redux'

// create Redux store with reducer
const store = createStore(reducer)

// pass store to SRStudyList
const SRStudyListWithStore = () => <SRStudyList store={store} />

const SpaceReminder = TabNavigator({
  StudyList: { screen: SRStudyListWithStore },
  AddStudyTaskScreen: { screen: SRStudyTaskEditor },
},
{
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
}
);

AppRegistry.registerComponent('SpaceReminder', () => SpaceReminder);

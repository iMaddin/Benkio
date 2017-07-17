// @flow

import React from 'react'
import { AppRegistry } from 'react-native'

import { TabNavigator } from 'react-navigation'
import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRSettings from './SRSettings'

import { reducer } from './dataModel/SRSimpleDataModel'
import { createStore } from 'redux'

// create Redux store with reducer
const store = createStore(reducer)

saveAction = (studyTask) => {
  console.log(`${studyTask}`);
}

// pass store to SRStudyList
const SRStudyListWithStore = () => <SRStudyList store={store} />
const SRStudyTaskEditorWithProps = () => <SRStudyTaskEditor saveAction={saveAction} />

const SpaceReminder = TabNavigator({
  StudyList: { screen: SRStudyListWithStore },
  AddStudyTaskScreen: { screen: SRStudyTaskEditorWithProps },
  Settings: { screen: SRSettings },
},
{
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
}
);

AppRegistry.registerComponent('SpaceReminder', () => SpaceReminder);

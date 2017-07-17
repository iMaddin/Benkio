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

// pass store to SRStudyList
const SRStudyListWithStore = () => <SRStudyList store={store} />
const SRStudyTaskEditorWithProps = () => <SRStudyTaskEditor store={store}/>

const SpaceReminder = TabNavigator({
  StudyList: {
    screen: SRStudyListWithStore,
    tabBarLabel: 'Study List', 
  },
  AddStudyTaskScreen: { screen: SRStudyTaskEditorWithProps },
  Settings: { screen: SRSettings },
},
{
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
}
);

export default class App extends React.Component {
  render() {
    return (
      <SpaceReminder />
    );
  }
}

AppRegistry.registerComponent('SpaceReminder', () => App);

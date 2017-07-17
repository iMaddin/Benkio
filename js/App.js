// @flow

import React from 'react'
import { AppRegistry } from 'react-native'

import { TabNavigator } from 'react-navigation'
import SRStudyList from './SRStudyList'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRSettings from './SRSettings'

import { reducer } from './dataModel/SRSimpleDataModel'
import { createStore } from 'redux'
import PropTypes from 'prop-types';

const SpaceReminder = TabNavigator({
  StudyList: { screen: SRStudyList },
  AddStudyTaskScreen: { screen: SRStudyTaskEditor },
  Settings: { screen: SRSettings },
  },
  {
    tabBarOptions: {
      activeTintColor: '#e91e63',
      showLabel: false,
      activeBackgroundColor: 'skyblue',
    },
  }
);

class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: PropTypes.object
};

class TaylorSwift extends React.Component {
  render() {
    const { store } = this.context

    const screenProps = {
      store: store,
    }

    return (
      <SpaceReminder screenProps={screenProps}/>
    );
  }
}

TaylorSwift.contextTypes = {
  store: PropTypes.object
};

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <TaylorSwift />
      </Provider>
    );
  }
}

AppRegistry.registerComponent('SpaceReminder', () => App);

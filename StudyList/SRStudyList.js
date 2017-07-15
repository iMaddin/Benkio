// @flow

import React from 'react';
import {
  AppRegistry,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class SRStudyList extends React.Component {
  static navigationOptions = {
    title: 'Study List',
  };

  render() {
    return (
        <Text>Hello Study List</Text>
    );
  }
}

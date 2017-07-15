// @flow

import React from 'react';
import {
  AppRegistry,
  Button,
  Text,
  View
} from 'react-native';
import { StackNavigator } from 'react-navigation';

export default class SRStudyList extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Study List',
      headerRight: (
        <Button
          title='+'
          onPress={() => ({})}
        />
      ),
    };
  };

  render() {
    return (
        <Text>Hello Study List</Text>
    );
  }
}

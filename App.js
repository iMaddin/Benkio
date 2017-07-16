// @flow

import React from 'react';
import {
  AppRegistry,
  Text,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import SRStudyList from './StudyList/SRStudyList';

const SpaceReminder = StackNavigator({
  StudyList: { screen: SRStudyList },
});

AppRegistry.registerComponent('SpaceReminder', () => SpaceReminder);

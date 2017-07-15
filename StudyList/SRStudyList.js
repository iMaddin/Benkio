// @flow

import React from 'react';
import {
  Button,
  SectionList,
  StyleSheet,
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
        <View style={sectionListStyles.container}>
        <SectionList
          sections={[
            {title: 'D', data: ['Devin']},
            {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
          ]}
          renderItem={({item}) => <Text style={sectionListStyles.item}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={sectionListStyles.sectionHeader}>{section.title}</Text>}
          />
        </View>
    );
  }
}

const sectionListStyles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})

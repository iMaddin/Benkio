// @flow

import React from 'react'
import {
  Button,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import { actionCreators } from './dataModel/SRSimpleDataModel'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import { processDataForList } from './dataModel/SRDataPresenter'

export default class SRStudyList extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Study List',
    tabBarIcon: ({ tintColor }) => (
      <Text>🔜</Text>
    ),
  };

  state = {}

  componentWillMount() {
    const {store} = this.props.screenProps

    const {studyTasks} = store.getState()
    this.setState({studyTasks})

    this.unsubscribe = store.subscribe(() => {
      const {studyTasks} = store.getState()
      this.setState({studyTasks})
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount() {

  }

  onAddTodo = (text: string) => {
    const {store} = this.props.screenProps

    store.dispatch(actionCreators.add(text))
  }

  onRemoveTodo = (index: number) => {
    const {store} = this.props.screenProps

    store.dispatch(actionCreators.remove(index))
  }

  render() {
    const {studyTasks} = this.state

    return (
        <View style={styles.container}>
        <SectionList
          sections={processDataForList(studyTasks)}
          renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
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

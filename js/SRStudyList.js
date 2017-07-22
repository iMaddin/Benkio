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
import SRStudyListCell from './SRStudyListCell'
import { processDataForList } from './dataModel/SRDataPresenter'

const studyListTitle = 'Study List'

export default class SRStudyList extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerLeft: <Button title='⚙️' onPress={() => params.openSettings()} />,
      tabBarLabel: studyListTitle,
      tabBarIcon: ({ tintColor }) => (
        <Text>🔜</Text>
      ),
      title: studyListTitle,
    }
  }

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
    this.props.navigation.setParams({openSettings: this.openSettings})
  }

  onAddTodo = (text: string) => {
    const {store} = this.props.screenProps

    store.dispatch(actionCreators.add(text))
  }

  onRemoveTodo = (index: number) => {
    const {store} = this.props.screenProps

    store.dispatch(actionCreators.remove(index))
  }

  openSettings = () => {

  }

  render() {
    const {studyTasks} = this.state

    return (
        <View style={styles.container}>
        <SectionList
          sections={processDataForList(studyTasks)}
          // renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderItem={({
            item,
            index,
            section,
            // separators: {
            //   highlight: () => void,
            //   unhighlight: () => void,
            //   updateProps: (select: 'leading' | 'trailing', newProps: Object) => void,
            // },
          }) => {
            return <SRStudyListCell>{{title: item, notes: 'notes'}}</SRStudyListCell>
          }}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
          />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  }
})

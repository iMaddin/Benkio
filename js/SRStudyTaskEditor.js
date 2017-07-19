import React from 'react'
import {
  Button,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View
} from 'react-native'
import { actionCreators } from './dataModel/SRSimpleDataModel'

const intensityOptions = {
  NORMAL: 'NORMAL',
  CUSTOM: 'CUSTOM', // allow user to choose by when something should be learned
}

// TODO: make tab bar open this modally like in Instagram app 
export default class SRStudyTaskEditor extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Add',
    tabBarIcon: ({ tintColor }) => (
      <Text>➕</Text>
    ),
  }

  // TODO: for opening editor with UI pre-filled with data
  props: {
    taskName: ?string,
    notes: ?string,
    dates: ?string,
    intensity: ?intensityOptions,
    saveAction: (studyTask) => any,
  }

  render() {
    const { taskName, notes, dates, intensity } = this.props

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.edgePadding}>
          <TextInput
            style={styles.dataInputItemPadding}
            placeholder="Study Task"
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={(studyTaskName) => this.setState({studyTaskName})}
          />
          <TextInput
            style={styles.dataInputItemPadding}
            placeholder="Notes"
            onSubmitEditing={Keyboard.dismiss}
          />
          <Text style={styles.dataInputItemPadding}>Date</Text>
          <Text style={styles.dataInputItemPadding}>Intensity</Text>
          <Button
            style={styles.dataInputItemPadding}
            title='Save'
            onPress={this.saveButtonAction}
          />
        </View>
      </ScrollView>
    )
  }

  saveButtonAction = () => {
    const { studyTaskName } = this.state
    const { store } = this.props.screenProps
    store.dispatch(actionCreators.add(studyTaskName))
  }

}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 44,
  },
  edgePadding: {
    padding: 15,
    flex:1,
  },
  dataInputItemPadding: {
    padding: 5,
  }
})

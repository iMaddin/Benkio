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
import { actionCreators, SRStudyTask, SRSpacedRepetition, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import expect, { createSpy, spyOn, isSpy } from 'expect'
import { uuid } from './utilities/UUID'

// TODO: make tab bar open this modally like in Instagram app
export default class SRStudyTaskEditor extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Add',
    tabBarIcon: ({ tintColor }) => (
      <Text>➕</Text>
    ),
  }

  constructor(props) {
    super(props)

    this.state = {
      id:             props.id == null            ? props.id            : uuid(),
      taskName:       props.taskName == null      ? props.taskName      : null,
      notes:          props.notes == null         ? props.notes         : null,
      dates:          props.dates == null         ? props.dates         : [new Date()],
      ratingHistory:  props.ratingHistory == null ? props.ratingHistory : [],
      srs:            props.srs == null           ? props.srs           : new SRSpacedRepetition(),
      intensity:      props.intensity == null     ? props.intensity     : SRStudyTaskIntensity.NORMAL
    }
  }

  props: {
    saveAction: (studyTask) => any,
  }

  render() {
    // const {  } = this.state

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.edgePadding}>
          <TextInput
            style={styles.dataInputItemPadding}
            placeholder="Study Task"
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={(taskName) => this.setState({taskName})}
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
    const { store } = this.props.screenProps

    const studyTask = new SRStudyTask(
      this.state.id,
      this.state.taskName,
      this.state.notes,
      this.state.dates,
      this.state.ratingHistory,
      this.state.srs,
      this.state.intensity
    )

    store.dispatch(actionCreators.add(studyTask))
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

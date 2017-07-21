// @flow
import React from 'react'
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  View
} from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import expect, { createSpy, spyOn, isSpy } from 'expect'
import moment from 'moment'
import { actionCreators, SRStudyTask, SRSpacedRepetition, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import { uuid } from './utilities/UUID'
import { capitalizeFirstLetter } from './utilities/String+Capitalize'

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
      id:             props.id != null            ? props.id            : uuid(),
      taskName:       props.taskName != null      ? props.taskName      : null,
      notes:          props.notes != null         ? props.notes         : null,
      dates:          props.dates != null         ? props.dates         : [new Date()],
      ratingHistory:  props.ratingHistory != null ? props.ratingHistory : [],
      srs:            props.srs != null           ? props.srs           : new SRSpacedRepetition(),
      intensity:      props.intensity != null     ? props.intensity     : SRStudyTaskIntensity.NORMAL,

      readonly: false,
    }
  }

  props: {
    saveAction: (studyTask) => any,
  }

  render() {
    const { dates, intensity, readonly } = this.state
    const newestDate = dates[dates.length-1]
    const formattedDate = moment().calendar(newestDate, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      sameElse: 'Do MMMM'
    });
    const capitalizedIntensity = capitalizeFirstLetter(intensity)
    const studyTaskInputTitle = 'Study Task'
    const notesInputTitle = 'Notes'
    const actionButtonTitle = readonly == true ? 'Edit' : 'Save'

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.edgePadding}>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>{studyTaskInputTitle}</Text>
            <TextInput
              style={styles.dataInputItemPadding}
              placeholder={studyTaskInputTitle}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(taskName) => this.setState({taskName})}
            />
            <View name='separator' style={styles.sectionSeparator}/>
          </View>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>{notesInputTitle}</Text>
            <TextInput
              style={styles.dataInputItemPadding}
              placeholder={notesInputTitle}
              onSubmitEditing={Keyboard.dismiss}
            />
            <View name='separator' style={styles.sectionSeparator}/>
          </View>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>Date</Text>
            {/* <TouchableHighlight
              style={styles.dataInputItemPadding}
              title={formattedDate}
              onPress={this.openDatePicker}
            /> */}
            <View name='separator' style={styles.sectionSeparator}/>
          </View>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>Intensity</Text>
            {/* <TouchableHighlight
              style={styles.dataInputItemPadding}
              title={capitalizedIntensity}
              onPress={this.changeIntensity}
            /> */}
            <View name='separator' style={styles.sectionSeparator}/>
          </View>
          <View style={[styles.sections, styles.bottomButtonsView]}>
            <TouchableHighlight
              style={[styles.dataInputItemPadding, styles.bottomButtons, styles.cancelButton]}
              onPress={this.cancelButtonAction}>
              <Text style={[styles.bottomButtonsText, styles.cancelButtonText]}>❌</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={[styles.dataInputItemPadding, styles.bottomButtons, styles.actionButton]}
              onPress={this.actionButtonAction}>
              <Text style={[styles.bottomButtonsText, styles.actionButtonText]}>{actionButtonTitle}</Text>
            </TouchableHighlight>
          </View>
        </View>
      </ScrollView>
    )
  }

  openDatePicker = () => {

  }

  changeIntensity = () => {

  }

  actionButtonAction = () => {
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

  cancelButtonAction = () => {

  }

}

const buttonHeight = 46
const buttonCornerRadius = buttonHeight/2

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
  },
  inputTitle: {
    fontSize: 14,
    color: '#48BEE0',
  },
  sectionSeparator: {
    backgroundColor: '#cdcdcd',
    height: 1,
  },
  sections: {
    padding: 10,
  },
  bottomButtonsView: {
    flexDirection: 'row',
  },
  bottomButtons: {
    alignItems: 'center',
    height: buttonHeight,
    justifyContent: 'center'
  },
  actionButton: {
    backgroundColor: '#48BEE0',
    borderTopRightRadius: buttonCornerRadius,
    borderBottomRightRadius: buttonCornerRadius,
    flex: 5,
  },
  cancelButton: {
    backgroundColor: '#fe4c00',
    borderTopLeftRadius: buttonCornerRadius,
    borderBottomLeftRadius: buttonCornerRadius,
    flex: 1,
  },
  bottomButtonsText: {
    color: 'white',
    fontSize: 16,
  },
  actionButtonText: {
    paddingTop: 1,
  },
  cancelButtonText: {
  }
})

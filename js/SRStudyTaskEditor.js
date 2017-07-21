// @flow
import React from 'react'
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import expect, { createSpy, spyOn, isSpy } from 'expect'
import moment from 'moment'
import { actionCreators, SRStudyTask, SRSpacedRepetition, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import { uuid } from './utilities/UUID'
import { capitalizeFirstLetter } from './utilities/String+Capitalize'

const studyTaskString = 'Study Task'
const notesString = 'Notes'

// TODO: make tab bar open this modally like in Instagram app
// TODO: text fields don't deal with white space only input
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

      studyTaskLabelString: ' ',
      notesLabelString: ' ',
      pickedDate: 'Other',
      selectedDateIndex: 0,
      selectedIntensityIndex: 0,
    }
  }

  props: {
    saveAction: (studyTask) => any,
  }

  render() {
    const { dates, intensity, notesLabelString, pickedDate, readonly, studyTaskLabelString, taskName } = this.state
    const newestDate = dates[dates.length-1]
    const formattedDate = moment().calendar(newestDate, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      sameElse: 'Do MMMM'
    });

    this.hideStudyTaskLabel(taskName == null || taskName == '')

    const capitalizedIntensity = capitalizeFirstLetter(intensity)
    const notesInputTitle = notesString
    const actionButtonTitle = readonly == true ? 'Edit' : 'Save'
    const formattedPickedDate = pickedDate // TODO:

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.edgePadding}>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>{studyTaskLabelString}</Text>
            <TextInput
              style={styles.dataInputItemPadding}
              placeholder={studyTaskString}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(taskName) => this.studyTextFieldOnChangeText(taskName)}
            />
            <View name='separator' style={styles.sectionSeparator}/>
          </View>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>{notesLabelString}</Text>
            <TextInput
              style={styles.dataInputItemPadding}
              placeholder={notesInputTitle}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(notes) => this.notesTextFieldOnChangeText(notes)}
            />
            <View name='separator' style={styles.sectionSeparator}/>
          </View>
          <View style={styles.sections}>
            <Text style={styles.inputTitle}>Date</Text>
            <SegmentedControlTab
              tabsContainerStyle={styles.tabsContainerStyle}
              tabStyle={styles.tabStyle}
              tabTextStyle={styles.tabTextStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTabTextStyle={styles.activeTabTextStyle}
              values={['Today', 'Yesterday', formattedPickedDate]}
              selectedIndex={this.state.selectedDateIndex}
              onTabPress={this.handleDateSelection}
            />
          </View>
          {/* <View style={styles.sections}>
            <Text style={styles.inputTitle}>Intensity</Text>
            <SegmentedControlTab
              values={[capitalizedIntensity, 'Custom']}
              selectedIndex={this.state.selectedIntensityIndex}
              onTabPress={this.handleIntensitySelection}
            />
          </View> */}
          <View style={[styles.sections, styles.bottomButtonsView]}>
            <TouchableOpacity
              style={[styles.dataInputItemPadding, styles.bottomButtons, styles.cancelButton]}
              onPress={this.cancelButtonAction}>
              <Text style={[styles.bottomButtonsText, styles.cancelButtonText]}>✖️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dataInputItemPadding, styles.bottomButtons, styles.actionButton]}
              onPress={this.actionButtonAction}>
              <Text style={[styles.bottomButtonsText, styles.actionButtonText]}>{actionButtonTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    )
  }

  studyTextFieldOnChangeText = (taskName) => {
    this.hideStudyTaskLabel(taskName == null || taskName == '')
    this.setState({taskName})
  }

  notesTextFieldOnChangeText = (notes) => {
    this.hideNotesLabel(notes == null || notes == '')
    this.setState({notes})
  }

  hideStudyTaskLabel = (flag = true) => {
    this.state.studyTaskLabelString = flag ? ' ' : studyTaskString
  }

  hideNotesLabel = (flag = true) => {
    this.state.notesLabelString = flag ? ' ' : notesString
  }

  handleDateSelection = (index) => {
    this.setState({...this.state, selectedDateIndex: index})
  }

  handleIntensitySelection = (index) => {
    this.setState({...this.state, selectedIntensityIndex: index})
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

const tintColor = '#48BEE0'
const inactiveColor = '#B6D8E2'
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
    color: tintColor,
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
    paddingTop: 30,
  },
  bottomButtons: {
    alignItems: 'center',
    height: buttonHeight,
    justifyContent: 'center'
  },
  actionButton: {
    backgroundColor: tintColor,
    borderTopRightRadius: buttonCornerRadius,
    borderBottomRightRadius: buttonCornerRadius,
    flex: 5,
  },
  cancelButton: {
    backgroundColor: '#E04D48',
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
    fontWeight: 'bold',
  },
  cancelButtonText: {
  },
  tabsContainerStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-around',
    height: buttonHeight,
  },
  tabStyle: {
    backgroundColor: inactiveColor,
    borderColor: inactiveColor,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
  },
  tabTextStyle: {
    fontWeight: 'bold',
    color: 'white',
  },
  activeTabStyle: {
    backgroundColor: tintColor,
    borderColor: tintColor,
  },
  activeTabTextStyle: {
  },
})

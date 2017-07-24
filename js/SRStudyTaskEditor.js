// @flow
import React from 'react'
import {
  Alert,
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
import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import { SRSpacedRepetition } from './SRSpacedRepetition'
import { uuid } from './utilities/UUID'
import { capitalizeFirstLetter } from './utilities/String+Capitalize'
import { tintColor } from './SRSettings'

const studyTaskString = 'Study Task'
const notesString = 'Notes'

const inactiveColor = '#B6D8E2'
const buttonHeight = 46
const buttonCornerRadius = buttonHeight/2
const cancelButtonTint = '#bababa'

const dateSegmentedControlCornerRadius = 4

export default class SRStudyTaskEditor extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      tabBarLabel: 'Add',
      tabBarIcon: ({ tintColor }) => (
        <Text>➕</Text>// TODO: disable this when in readonly mode
      ),
      headerStyle: {
        backgroundColor: 'white'
      },
      title: (params.readonly) ? 'Details' : 'Add a task',
    }
  }

  constructor(props) {
    super(props)

    const { params } = props.navigation.state

    this.state = {
      id:             params != null ? params.item.id            : uuid(),
      taskName:       params != null ? params.item.taskName      : null,
      notes:          params != null ? params.item.notes         : null,
      dates:          params != null ? params.item.dates         : [new Date()],
      ratingHistory:  params != null ? params.item.ratingHistory : [],
      srs:            params != null ? params.item.srs           : new SRSpacedRepetition(),
      intensity:      params != null ? params.item.intensity     : SRStudyTaskIntensity.NORMAL,

      readonly: params != null ? params.readonly : false,

      studyTaskLabelString: params != null ? studyTaskString : ' ',
      notesLabelString: params != null ? notesString : ' ',
      pickedDate: 'Other',
      selectedDateIndex: 0,
      selectedIntensityIndex: 0,
    }
  }

  props: {
    saveAction: (studyTask) => any,
  }

  componentWillReceiveProps() {
    const { notes, taskName } = this.state
    this.hideStudyTaskLabel(taskName == null || taskName == '')
    this.hideNotesLabel(notes == null || notes == '')
  }

  render() {
    const { dates, intensity, notes, readonly, studyTaskLabelString, taskName } = this.state

    // causes warning
    // const newestDate = dates[dates.length-1]
    // const formattedDate = moment().calendar(newestDate, {
    //   sameDay: '[Today]',
    //   lastDay: '[Yesterday]',
    //   sameElse: 'MMMM'
    // });



    const actionButtonTitle = (readonly == true) ? 'Edit' : 'Save'
    const destructiveButtonTitle = (readonly == true) ? 'Delete' : 'Cancel'

    // const capitalizedIntensity = capitalizeFirstLetter(intensity)

    const NOT_IMPLEMENTED = false

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.edgePadding}>

          <View style={styles.sections}>
            <Text style={styles.sectionLabel}>{studyTaskLabelString}</Text>
            <TextInput
              style={styles.dataInputItemPadding}
              placeholder={studyTaskString}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(taskName) => this.studyTextFieldOnChangeText(taskName)}
              value={taskName}
            />
            {this._renderSeparator(!readonly)}
          </View>

          {this._renderNotes(!readonly || (notes != null && notes != ''))}
          {this._renderDateSelection(!readonly)}
          {this._renderRatingHistory(NOT_IMPLEMENTED)}

          {/* <View style={styles.sections}>
            <Text style={styles.sectionLabel}>Intensity</Text>
            <SegmentedControlTab
              values={[capitalizedIntensity, 'Custom']}
              selectedIndex={this.state.selectedIntensityIndex}
              onTabPress={this.handleIntensitySelection}
            />
          </View> */}
          <View name='dataSeparator' style={[styles.sectionSeparator, styles.lastSectionSeparator]}/>

          <View style={[styles.sections, styles.bottomButtonsView]}>
            <TouchableOpacity
              style={[styles.dataInputItemPadding, styles.bottomButtons, styles.actionButton]}
              onPress={this.actionButtonAction}>
              <Text style={[styles.bottomButtonsText, styles.actionButtonText]}>{actionButtonTitle}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dataInputItemPadding, styles.bottomButtons, styles.cancelButton]}
              onPress={this.destructiveButtonAction}>
              <Text style={[styles.bottomButtonsText, styles.destructiveButtonText]}>{destructiveButtonTitle}</Text>
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
    this.setState({
      studyTaskLabelString: flag ? ' ' : studyTaskString
    })
  }

  hideNotesLabel = (flag = true) => {
    this.setState({
      notesLabelString: flag ? ' ' : notesString
    })
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

    if(this.state.readonly) {
      store.dispatch(actionCreators.replace(studyTask))
    } else {
      store.dispatch(actionCreators.add(studyTask))
      this.dismissView()
    }
  }

  destructiveButtonAction = () => {
    if (this.state.readonly) {
      Alert.alert(
        'Delete Study Task',
        'Are you sure you want to delete the study task?',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {text: 'Delete', onPress: () => {
            // expect(this.state.id).toEqual('ada', `this.state.id: ${this.state.id}`)
            this.props.screenProps.store.dispatch(actionCreators.remove({id: this.state.id}))
            this.dismissView()
          }},
        ],
        { cancelable: true }
      )

    }
  }

  _renderSeparator = (flag) => {
    if(flag) {
      return <View name='separator' style={styles.sectionSeparator}/>
    } else {
      return null
    }
  }

  _renderNotes = (flag) => {
      if(flag) {
        const { notes, notesLabelString, readonly } = this.state
        return(
          <View style={styles.sections}>
            <Text style={styles.sectionLabel}>{notesLabelString}</Text>
            <TextInput
              style={styles.dataInputItemPadding}
              placeholder={notesString}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(notes) => this.notesTextFieldOnChangeText(notes)}
              value={notes}
            />
            {this._renderSeparator(!readonly)}
          </View>
        )
      } else {
        return null
      }
  }

  _renderDateSelection = (flag) => {
    if(flag) {
      const { pickedDate } = this.state
      const formattedPickedDate = pickedDate // TODO:
      return (
        <View style={styles.sections}>
          <Text style={styles.sectionLabel}>Date</Text>
          <SegmentedControlTab
            borderRadius={dateSegmentedControlCornerRadius}
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
      )
    } else {
      return null
    }
  }

  _renderRatingHistory = (flag) => {
    if(flag) {

      return (
        <View style={styles.sections}>
          <Text style={styles.sectionLabel}>Rating History</Text>

        </View>
      )
    } else {
      return null
    }
  }

  dismissView = () => {

  }

}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'white',
  },
  edgePadding: {
    padding: 15,
    flex:1,
  },
  dataInputItemPadding: {
    padding: 4,
  },
  sectionLabel: {
    fontSize: 14,
    color: tintColor,
  },
  sectionSeparator: {
    backgroundColor: cancelButtonTint,
    height: 1,
  },
  lastSectionSeparator: {
    marginTop: 8,
  },
  sections: {
    padding: 8,
  },
  bottomButtonsView: {
    flexDirection: 'column',
    paddingTop: 20,
  },
  bottomButtons: {
    alignItems: 'center',
    height: buttonHeight,
    justifyContent: 'center',
  },
  actionButton: {
    backgroundColor: tintColor,
    borderRadius: buttonCornerRadius,
    flex: 1,
  },
  cancelButton: {
    borderColor: cancelButtonTint,
    borderWidth: 2,
    borderRadius: buttonCornerRadius,
    flex: 1,
    marginTop: 10,
  },
  bottomButtonsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonText: {
    paddingTop: 1,
  },
  destructiveButtonText: {
    color: cancelButtonTint,
  },
  tabsContainerStyle: {
    paddingTop: 5,
    paddingBottom: 5,
    height: buttonHeight,
  },
  tabStyle: {
    backgroundColor: inactiveColor,
    borderColor: inactiveColor,
    borderRadius: dateSegmentedControlCornerRadius,
    marginLeft: 2,
    marginRight: 2,
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

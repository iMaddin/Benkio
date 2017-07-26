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
import { NavigationActions } from 'react-navigation'
import PropTypes from 'prop-types'

import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import { SRSpacedRepetition } from './SRSpacedRepetition'
import { uuid } from './utilities/UUID'
import { capitalizeFirstLetter } from './utilities/String+Capitalize'
import {SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor} from './utilities/SRColors'

const studyTaskString = 'Study Task'
const notesString = 'Notes'
const dateString = 'Starting Date'

const SRPlaceholderTextColor = 'rgba(251, 251, 253, 0.5)'

const inactiveColor = SRBrightColor
const buttonHeight = 46
const buttonCornerRadius = buttonHeight/2
const cancelButtonTint = SRDarkColor
const tintColor = SRRedColor

const dateSegmentedControlCornerRadius = 4

export default class SRStudyTaskEditor extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state

    return {
      headerTintColor: SRDarkColor,
      headerStyle: {
        backgroundColor: SRBrightColor
      },
      title: (params.readonly) ? 'Details' : 'Add a task',
    }
  }

  constructor(props) {
    super(props)

    const { params } = props.navigation.state

    this.state = {
      readonly: params != null ? params.readonly : false,
      editMode: false,
      hasChanges: false,

      id:             params != null ? params.item.id            : uuid(),
      taskName:       params != null ? params.item.taskName      : null,
      notes:          params != null ? params.item.notes         : null,
      dates:          params != null ? params.item.dates         : [new Date()],
      ratingHistory:  params != null ? params.item.ratingHistory : [],
      srs:            params != null ? params.item.srs           : new SRSpacedRepetition(),
      intensity:      params != null ? params.item.intensity     : SRStudyTaskIntensity.NORMAL,

      studyTaskLabelString: (params != null && params.item.taskName != null) ? studyTaskString : ' ',
      notesLabelString: (params != null && params.item.notes != null) ? notesString : ' ',
      pickedDate: 'Other', // TODO: implement
      selectedDateIndex: 0,
      selectedIntensityIndex: 0,
    }
  }

  props: {
    saveAction: (studyTask) => any,
  }

  componentWillReceiveProps() {

  }

  componentWillMount() {
    const { notes, taskName } = this.state

    const taskNameTextFieldIsEmpty = taskName == null || taskName == ''
    this.hideStudyTaskLabel(taskNameTextFieldIsEmpty)

    const notesTextFieldIsEmpty = notes == null || notes == ''
    this.hideNotesLabel(notesTextFieldIsEmpty)
  }

  componentDidMount() {
    this.setState({originalState: this.state})
  }

  render() {
    const { dates, intensity, notes, editMode, readonly, studyTaskLabelString, taskName } = this.state

    const actionButtonTitle = (readonly && editMode == false) ? 'Edit' : 'Save'
    const destructiveButtonTitle = (readonly && editMode == false) ? 'Delete' : 'Cancel'

    const disableActionButton = taskName == null || taskName == ''
    const editingOrAddingNewTask = editMode || !readonly
    const viewingOnly = readonly && !editMode
    const notesExistOrEditingOrAddingTask = !readonly || editMode || (notes != null && notes != '')
    const NOT_IMPLEMENTED = false

    return (
      <ScrollView
        style={styles.scrollView}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'handled'}
        >
        <View style={styles.edgePadding}>

          <View style={styles.sections}>
            <Text style={styles.sectionLabel}>{studyTaskLabelString}</Text>
            <TextInput
              style={[styles.dataInputItemPadding, styles.textInput]}
              placeholder={studyTaskString}
              placeholderTextColor={SRPlaceholderTextColor}
              onSubmitEditing={(event) => {
                this.refs.notesTextInput.focus()
              }}
              onChangeText={(taskName) => this.studyTextFieldOnChangeText(taskName)}
              value={taskName}
              editable={editingOrAddingNewTask}
              multiline={viewingOnly}
              autoFocus={!readonly}
              returnKeyType={'next'}
            />
            {this._renderSeparator(editingOrAddingNewTask)}
          </View>

          {this._renderNotes(notesExistOrEditingOrAddingTask)}
          {this._renderDateSelection(!readonly)}
          {this._renderRatingHistory(NOT_IMPLEMENTED)}

          <View name='dataSeparator' style={[styles.sectionSeparator, styles.lastSectionSeparator]}/>

          <View style={[styles.sections, styles.bottomButtonsView]}>
            <TouchableOpacity
              style={this.disabledButtonStyle(disableActionButton)}
              disabled={disableActionButton}
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

  // Data input

  studyTextFieldOnChangeText = (taskName) => {
    const taskNameExists = taskName == null || taskName == ''
    this.hideStudyTaskLabel(taskNameExists)
    this.setState({
      taskName,
      hasChanges: true
    })
  }

  notesTextFieldOnChangeText = (notes) => {
    const notesExist = notes == null || notes == ''
    this.hideNotesLabel(notesExist)
    this.setState({
      notes,
      hasChanges: true
    })
  }

  handleDateSelection = (index) => {
    var selectedDate = ''
    switch(index) {
      case 0:
        selectedDate = new Date()
        break
      case 1:
        selectedDate = new Date(moment().subtract(1, 'days'))
        break
      case 2:
        openDatePicker()
        break
      default:
      throw 'handleDateSelection()'
    }

    this.setState({
      ...this.state,
      dates: [selectedDate],
      selectedDateIndex: index,
      hasChanges: true
    })
  }

  handleIntensitySelection = (index) => {
    this.setState({...this.state,
      selectedIntensityIndex: index,
      hasChanges: true
    })
  }

  // Actions

  actionButtonAction = () => {
    const wantsEdit = this.state.readonly && !this.state.editMode

    if(wantsEdit) {
      this.setState({editMode: true})
    } else { // Save data input
      const { readonly, saveAction } = this.props
      const { taskName, notes, date } = this.state

      expect(taskName).toExist('No taskName')
      expect(taskName).toNotEqual('','taskName is empty string')

      const item = {
        title: taskName,
        notes: notes,
        date: date,
      }

      if(this.state.readonly) {
        dispatch(replace(studyTask))
        this.setState({editMode: false})
      } else {
        saveAction(item)
        this.dismissView()
      }
    }

  }

  destructiveButtonAction = () => {
    const { editMode, hasChanges, readonly } = this.state
    const deleteWhenReadonly = readonly && !editMode
    const cancelEditing = readonly && editMode
    const dismissAddingNewTask = !readonly

    if (deleteWhenReadonly) {
      Alert.alert(
        'Delete Study Task',
        'Are you sure you want to delete the study task? This cannot be undone.',
        [
          {text: 'Cancel', onPress: () => {}, style: 'cancel'},
          {text: 'Delete', onPress: () => {
            this.props.screenProps.store.dispatch(actionCreators.remove({id: this.state.id}))
            this.dismissView()
          }},
        ],
        { cancelable: true }
      )
    } else if(cancelEditing) {
      if (hasChanges) {
        Alert.alert(
          'Discard Changes',
          'Are you sure you want to discard your changes?',
          [
            {text: 'Keep Editing', onPress: () => {}, style: 'cancel'},
            {text: 'Discard Changes', onPress: () => {
              this.resetFields()
              this.setState({editMode: false})
            }},
          ],
          { cancelable: true }
        )
      } else {
        this.resetFields()
        this.setState({editMode: false})
      }
    } else if (dismissAddingNewTask) {
      this.dismissView()
    } else {
      expect(0).toBe(1, 'destructiveButtonAction() else')
    }
  }

  resetFields = () => {
    const { params } = this.props.navigation.state
    expect(params).toExist('resetFields(): params == null')
    if (params == null) { return }

    const {
      hasChanges,
      id,
      taskName,
      notes,
      dates,
      ratingHistory,
      srs,
      intensity,
      studyTaskLabelString,
      notesLabelString,
      pickedDate,
      selectedDateIndex,
      selectedIntensityIndex
    } = this.state.originalState

    this.setState({
      hasChanges,
      id,
      taskName,
      notes,
      dates,
      ratingHistory,
      srs,
      intensity,
      studyTaskLabelString,
      notesLabelString,
      pickedDate,
      selectedDateIndex,
      selectedIntensityIndex
    })
  }

  // UI changes

  hideStudyTaskLabel = (flag = true) => {
    this.setState({
      studyTaskLabelString: flag ? ' ' : studyTaskString.toUpperCase()
    })
  }

  hideNotesLabel = (flag = true) => {
    this.setState({
      notesLabelString: flag ? ' ' : notesString.toUpperCase()
    })
  }

  openDatePicker = () => {
    // TODO: missing implementation
    // pickedDate = '' // set this to a nicely formatted date
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
        const { notes, notesLabelString, editMode, readonly } = this.state
        const editingOrAddingNewTask = editMode || !readonly
        const viewingOnly = readonly && !editMode
        return(
          <View style={styles.sections}>
            <Text style={styles.sectionLabel}>{notesLabelString}</Text>
            <TextInput
              ref='notesTextInput'
              style={[styles.dataInputItemPadding, styles.textInput]}
              placeholder={notesString}
              placeholderTextColor={SRPlaceholderTextColor}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(notes) => this.notesTextFieldOnChangeText(notes)}
              value={notes}
              editable={editingOrAddingNewTask}
              multiline={viewingOnly}
              returnKeyType={'done'}
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
          <Text style={styles.sectionLabel}>{dateString.toUpperCase()}</Text>
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
      // TODO: missing implementation
      // if made changes then set hasChanges: true
      return (
        <View style={styles.sections}>
          <Text style={styles.sectionLabel}>Rating History</Text>

        </View>
      )
    } else {
      return null
    }
  }

  disabledButtonStyle = (flag) => {
    const defaultStyle = [styles.dataInputItemPadding, styles.bottomButtons, styles.actionButton]
    if(flag) {
      return [...defaultStyle, styles.actionButtonDisabled]
    } else {
      return defaultStyle
    }
  }

  dismissView = () => {
    const { navigation, screenProps } = this.props
    const { readonly } = this.state
    if(readonly) {
      navigation.dispatch(NavigationActions.back())
    } else {
      const { cancelAction } = this.props
      cancelAction()
    }
  }

}

SRStudyTaskEditor.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    notes: PropTypes.string,
  }),

  saveAction: PropTypes.func.isRequired,
  editAction: PropTypes.func,
  deleteAction: PropTypes.func,
  cancelAction: PropTypes.func,

  readonly: PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: SRDarkColor,
  },
  edgePadding: {
    padding: 15,
    flex:1,
  },
  dataInputItemPadding: {
    padding: 4,
  },
  textInput: {
    fontSize: 48,
    color: SRBrightColor,
  },
  sectionLabel: {
    fontSize: 20,
    color: SRRedColor,
    fontWeight: 'bold'
  },
  sectionSeparator: {
    backgroundColor: SRBrightColor,
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
    backgroundColor: SRYellowColor,
    borderRadius: buttonCornerRadius,
    flex: 1,
  },
  actionButtonDisabled: {
    backgroundColor: 'rgba(255, 252, 49, 0.5)'
  },
  cancelButton: {
    borderColor: SRYellowColor,
    borderWidth: 1,
    borderRadius: buttonCornerRadius,
    flex: 1,
    marginTop: 10,
  },
  bottomButtonsText: {
    color: SRDarkColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonText: {
    paddingTop: 1,
  },
  destructiveButtonText: {
    color: SRYellowColor,
  },
  tabsContainerStyle: {
    paddingTop: 15,
    paddingBottom: 5,
    height: buttonHeight+14,
  },
  tabStyle: {
    backgroundColor: SRBrightColor,
    borderColor: SRBrightColor,
    borderRadius: dateSegmentedControlCornerRadius,
    marginLeft: 2,
    marginRight: 2,
  },
  tabTextStyle: {
    fontWeight: 'bold',
    color: SRDarkColor,
  },
  activeTabStyle: {
    backgroundColor: SRYellowColor,
    borderColor: SRYellowColor,
  },
  activeTabTextStyle: {
    color: SRDarkColor
  },
})

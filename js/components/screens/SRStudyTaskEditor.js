// @flow
import React from 'react'
import {
  Alert,
  Keyboard,
  LayoutAnimation,
  NativeModules,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  View
} from 'react-native'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import expect from 'expect'
import moment from 'moment'
import PropTypes from 'prop-types'
import KeyboardAwareScrollView from '../keyboard-aware-scrollview/KeyboardAwareScrollView'

import { capitalizeFirstLetter } from '../../utilities/String+Capitalize'
import { SRColor } from '../../utilities/SRColor'

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

// Required to use LayoutAnimation on Android
const { UIManager } = NativeModules;
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

const springDamping = 0.6

const animateEditing = {
  duration: 400,
  create: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: springDamping,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.scaleXY,
    springDamping: springDamping,
  },
  delete: {
    type: LayoutAnimation.Types.spring,
    property: LayoutAnimation.Properties.opacity,
    springDamping: springDamping,
  },
}

export default class SRStudyTaskEditor extends React.Component {

  _taskInputRef: TextInput = null
  _noteInputRef: TextInput = null

  static navigationOptions = (props) => {
    const { readonly } = props

    return {
      headerTintColor: SRColor.DarkColor,
      headerStyle: {
        backgroundColor: SRColor.BrightColor
      },
      title: readonly ? 'Details' : 'Add a task',
    }
  }

  state: {
    editMode: bool,
    hasChanges: bool,

    taskName: string,
    notes: string,
    date: string,

    studyTaskLabelString: string,
    notesLabelString: string,
    pickedDate: string,
    selectedDateIndex: number,
    selectedIntensityIndex: number,
  }

  _initialState = (props: Object) => {
    const { item } = props

    return {
      editMode: false,
      hasChanges: false,

      taskName: item != null && item.taskName != null ? item.taskName : '',
      notes: item != null && item.notes != null ? item.notes : '',
      date: new Date().toString(),

      studyTaskLabelString: item != null && item.taskName != null ? studyTaskString.toUpperCase() : ' ',
      notesLabelString: item != null && item.notes != null ? notesString.toUpperCase() : ' ',
      pickedDate: 'Other', // TODO: implement
      selectedDateIndex: 0,
      selectedIntensityIndex: 0,
    }
  }

  constructor(props: Object) {
    super(props)
    this.state = this._initialState(props)
  }

  componentWillMount() {
    this.updateUIStates(this.props)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {
    const { readonly } = this.props
    const {
      editMode,
      taskName,
      notes,
      studyTaskLabelString
    } = this.state

    const actionButtonTitle = (readonly && editMode == false) ? 'Edit' : 'Save'
    const destructiveButtonTitle = (readonly && editMode == false) ? 'Delete' : 'Cancel'

    const disableActionButton = taskName == null || taskName == ''
    const editingOrAddingNewTask = editMode || !readonly
    const viewingOnly = readonly && !editMode
    const notesExistOrEditingOrAddingTask = !readonly || editMode || (notes != null && notes != '')
    const NOT_IMPLEMENTED = false

    return (
      <KeyboardAwareScrollView
        style={styles.scrollView}
        keyboardDismissMode={'on-drag'}
        keyboardShouldPersistTaps={'handled'}
        getTextInputRefs={() => {
          var refs = []
          if(this._taskInputRef != null) {
            refs.push(this._taskInputRef)
          }
          if(this._noteInputRef != null) {
            refs.push(this._noteInputRef)
          }
          return refs
        }}
        >
        <View style={styles.edgePadding}>

          <View style={styles.sections}>
            <Text style={styles.sectionLabel}>{studyTaskLabelString}</Text>
            <TextInput
              style={[styles.dataInputItemPadding, styles.textInput]}
              placeholder={studyTaskString}
              placeholderTextColor={SRPlaceholderTextColor}
              onSubmitEditing={(event) => {
                this._noteInputRef.focus()
              }}
              onChangeText={(taskName) => this.studyTextFieldOnChangeText(taskName)}
              value={taskName}
              editable={editingOrAddingNewTask}
              multiline={true}
              autoFocus={!readonly}
              returnKeyType={'next'}
              blurOnSubmit={true}
              ref={(r) => { this._taskInputRef = r }}
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
      </KeyboardAwareScrollView>
    )
  }

  // Data input

  studyTextFieldOnChangeText = (taskName: string) => {
    const taskNameExists = taskName == null || taskName == ''
    this.hideStudyTaskLabel(taskNameExists)
    this.setState({
      taskName,
      hasChanges: true
    })
  }

  notesTextFieldOnChangeText = (notes: string) => {
    const notesExist = notes == null || notes == ''
    this.hideNotesLabel(notesExist)
    this.setState({
      notes,
      hasChanges: true
    })
  }

  handleDateSelection = (index: number) => {
    var selectedDate = new Date()
    switch(index) {
      case 0:
        selectedDate = new Date()
        break
      case 1:
        selectedDate = new Date(moment().subtract(1, 'days'))
        break
      case 2:
        this.openDatePicker()
        break
      default:
      throw 'handleDateSelection()'
    }

    this.setState({
      date: selectedDate.toString(),
      selectedDateIndex: index,
      hasChanges: true
    })
  }

  handleIntensitySelection = (index: number) => {
    this.setState({
      selectedIntensityIndex: index,
      hasChanges: true
    })
  }

  // Actions

  actionButtonAction = () => {
    const { readonly, item } = this.props
    const { editMode } = this.state
    const wantsEdit = readonly && !editMode

    if(wantsEdit) {
      LayoutAnimation.configureNext(animateEditing)
      this.setState({editMode: true})
    } else { // Save data input
      const { readonly, saveAction } = this.props
      const { taskName, notes, date } = this.state

      expect(taskName).toExist('No taskName')
      expect(taskName).toNotEqual('','taskName is empty string')

      const newItemChanges = {
        taskName: taskName,
        notes: notes,
        date: date,
      }

      saveAction(newItemChanges, item)
      if(readonly) {
        LayoutAnimation.configureNext(animateEditing)
        this.setState({editMode: false})
      }
    }

  }

  destructiveButtonAction = () => {
    const { readonly, deleteAction, cancelAction, item } = this.props
    const { editMode, hasChanges } = this.state
    const deleteWhenReadonly = readonly && !editMode
    const cancelEditing = readonly && editMode
    const dismissAddingNewTask = !readonly

    if (deleteWhenReadonly) {
      deleteAction(item)
    } else if(cancelEditing) {
      if (hasChanges) {
        Alert.alert(
          'Discard Changes',
          'Are you sure you want to discard your changes?',
          [
            {text: 'Keep Editing', onPress: () => {}, style: 'cancel'},
            {text: 'Discard Changes', onPress: () => {
              this.resetFields()
              LayoutAnimation.configureNext(animateEditing)
              this.setState({editMode: false})
            }},
          ],
          { cancelable: true }
        )
      } else {
        this.resetFields()
        LayoutAnimation.configureNext(animateEditing)
        this.setState({editMode: false})
      }
    } else if (dismissAddingNewTask) {
      cancelAction()
    } else {
      expect(0).toBe(1, 'destructiveButtonAction() else')
    }
  }

  resetFields = () => {
    this.setState({
      ...this.state,
      ...this._initialState(this.props),
    })
  }

  // UI changes

  updateUIStates = (props: Object) => {
    const { item } = props
    if(item != null) {
      const { notes, taskName } = item
      const taskNameTextFieldIsEmpty = taskName == null || taskName == ''
      this.hideStudyTaskLabel(taskNameTextFieldIsEmpty)

      const notesTextFieldIsEmpty = notes == null || notes == ''
      this.hideNotesLabel(notesTextFieldIsEmpty)
    }
  }

  hideStudyTaskLabel = (flag: bool = true) => {
    this.setState({
      studyTaskLabelString: flag ? ' ' : studyTaskString.toUpperCase()
    })
  }

  hideNotesLabel = (flag: bool = true) => {
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
      return <View name='separator' style={{height: 1}}/>
    }
  }

  _renderNotes = (flag) => {
      if(flag) {
        const { readonly } = this.props
        const { notes, notesLabelString, editMode } = this.state
        const editingOrAddingNewTask = editMode || !readonly
        const viewingOnly = readonly && !editMode
        return(
          <View style={styles.sections}>
            <Text style={styles.sectionLabel}>{notesLabelString}</Text>
            <TextInput
              style={[styles.dataInputItemPadding, styles.textInput]}
              placeholder={notesString}
              placeholderTextColor={SRPlaceholderTextColor}
              onSubmitEditing={Keyboard.dismiss}
              onChangeText={(notes) => this.notesTextFieldOnChangeText(notes)}
              value={notes}
              editable={editingOrAddingNewTask}
              multiline={true}
              returnKeyType={'done'}
              blurOnSubmit={true}
              ref={(r) => { this._noteInputRef = r }}
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
            values={['Today', 'Yesterday']}
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

  disabledButtonStyle = (flag: bool) => {
    const defaultStyle = [styles.dataInputItemPadding, styles.bottomButtons, styles.actionButton]
    if(flag) {
      return [...defaultStyle, styles.actionButtonDisabled]
    } else {
      return defaultStyle
    }
  }

}

SRStudyTaskEditor.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string,
    notes: PropTypes.string,
  }),

  saveAction: PropTypes.func.isRequired,
  deleteAction: PropTypes.func,
  cancelAction: PropTypes.func,

  readonly: PropTypes.bool.isRequired,
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: SRColor.DarkColor,
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
    color: SRColor.BrightColor,
  },
  sectionLabel: {
    fontSize: 20,
    color: SRColor.RedColor,
    fontWeight: 'bold'
  },
  sectionSeparator: {
    backgroundColor: SRColor.BrightColor,
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
    backgroundColor: SRColor.YellowColor,
    borderRadius: buttonCornerRadius,
    flex: 1,
  },
  actionButtonDisabled: {
    backgroundColor: 'rgba(255, 252, 49, 0.5)'
  },
  cancelButton: {
    borderColor: SRColor.YellowColor,
    borderWidth: 1,
    borderRadius: buttonCornerRadius,
    flex: 1,
    marginTop: 10,
  },
  bottomButtonsText: {
    color: SRColor.DarkColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonText: {
    paddingTop: 1,
  },
  destructiveButtonText: {
    color: SRColor.YellowColor,
  },
  tabsContainerStyle: {
    paddingTop: 15,
    paddingBottom: 5,
    height: buttonHeight+14,
  },
  tabStyle: {
    backgroundColor: SRColor.BrightColor,
    borderColor: SRColor.BrightColor,
    borderRadius: dateSegmentedControlCornerRadius,
    marginLeft: 2,
    marginRight: 2,
  },
  tabTextStyle: {
    fontWeight: 'bold',
    color: SRColor.DarkColor,
  },
  activeTabStyle: {
    backgroundColor: SRColor.YellowColor,
    borderColor: SRColor.YellowColor,
  },
  activeTabTextStyle: {
    color: SRColor.DarkColor
  },
})

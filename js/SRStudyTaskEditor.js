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

import { capitalizeFirstLetter } from './utilities/String+Capitalize'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'

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

const springDamping = 1.2

/**
 * TextInput editable is set to true, it deletes the non-editable text and creates editable text.
 * The same is true the other way around when editable is set to false.
 *
 * That's why create: and delete: property needs to be opacity for TextInput's change of editable to be smooth.
 * Otherwise it will delete: animate the non-editable text and create: animate the editable text.
 *
 */
const animateEditingTrue = {
    duration: 500,
    create: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
      // springDamping: springDamping,
    },
    update: {
      type: LayoutAnimation.Types.spring,
      property: LayoutAnimation.Properties.scaleXY,
      springDamping: springDamping,
    },
    delete: {
      type: LayoutAnimation.Types.linear,
      property: LayoutAnimation.Properties.opacity,
      // springDamping: springDamping,
    },
  }

  const animateEditingFalse = {
      duration: 500,
      // create: {
      //   type: LayoutAnimation.Types.spring,
      //   property: LayoutAnimation.Properties.scaleXY,
      //   springDamping: springDamping,
      // },
      update: {
        type: LayoutAnimation.Types.spring,
        property: LayoutAnimation.Properties.scaleXY,
        springDamping: springDamping,
      },
      // delete: {
      //   type: LayoutAnimation.Types.spring,
      //   property: LayoutAnimation.Properties.opacity,
      //   springDamping: springDamping,
      // },
    }

export default class SRStudyTaskEditor extends React.Component {

  static navigationOptions = (props) => {
    const { readonly } = props

    return {
      headerTintColor: SRDarkColor,
      headerStyle: {
        backgroundColor: SRBrightColor
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

      studyTaskLabelString: item != null && item.taskName != null ? studyTaskString : ' ',
      notesLabelString: item != null && item.notes != null ? notesString : ' ',
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
      LayoutAnimation.configureNext(animateEditingTrue)
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
        LayoutAnimation.configureNext(animateEditingFalse)
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
              LayoutAnimation.configureNext(animateEditingFalse)
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
      return null
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

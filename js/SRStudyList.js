// @flow
import React from 'react'
import {
  Alert,
  ListView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { NavigationActions, StackNavigator } from 'react-navigation'
import { withMappedNavigationProps } from 'react-navigation-props-mapper'
import expect from 'expect'
import moment from 'moment'
import {connect} from 'react-redux'

import SRRatingView from './SRRatingView'
import SRStudyListCell from './SRStudyListCell'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRTypographicCell from './SRTypographicCell'
import { SRSGrade } from './SRSpacedRepetition'
import { SRSpacedRepetition } from './SRSpacedRepetition'
import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './dataModel/SRSimpleDataModel'
import { processDataForList } from './dataModel/SRDataPresenter'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'
import { uuid } from './utilities/UUID'
import { AddStudyTaskScreenName } from './SRHome'

const studyListTitle = 'Reviews'

export class SRStudyList extends React.Component {

  static navigationOptions = (props) => {
    return {
      headerTintColor: SRDarkColor,
      headerStyle: { backgroundColor: SRBrightColor},
      title: studyListTitle,
    }
  }

  props: {

  }

  state: {
    dataSource: ListView.DataSource,
    ratingModalisVisible: bool,
    renderEmptyStateHeader: bool,
    selectedID: string,
  }

  constructor(props: Object) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      ratingModalisVisible: false,
      selectedID: '',
      renderEmptyStateHeader: false,
    }
  }

  componentWillMount() {
    const {studyTasks} = this.props
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(processDataForList(studyTasks))
    })
  }

  componentDidMount() {
  }

  componentWillReceiveProps(newProps: Object) {
    const {studyTasks} = newProps
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(processDataForList(studyTasks))
    })
    this.updateStuff()
  }

  updateStuff = () => {
    const { studyTasks } = this.props
    const { dataSource } = this.state
    console.log(`FOO LENGTH: ${studyTasks}`)
    const foo = processDataForList(studyTasks)
    var showEmptyStateHeader = false
    const noDataYet = foo.length == 0 //dataSource.getRowCount() == 0
    console.log(`updateStuff(): noDataYet: ${noDataYet}`)
    if(noDataYet) {
      showEmptyStateHeader = true
      // see if this is called after table view changes
    } else {
      const firstItem = foo[0]//dataSource.getRowData(0, 0)
      const onlyFutureTasks = (new Date(firstItem.date) > new Date())
      if(onlyFutureTasks) {
        showEmptyStateHeader = true
      }
    }

    this.setState({
      renderEmptyStateHeader: showEmptyStateHeader,
    })
  }

  render() {
    const {
      dataSource,
      renderEmptyStateHeader,

      ratingModalisVisible
    } = this.state
    const { addItem, action } = this.props


    return (
      <View style={styles.container}>
        {this._renderEmptyStateHeader(renderEmptyStateHeader)}
        <ListView
          contentContainerStyle={styles.tableViewContainer}
          style={styles.tableView}
          dataSource={dataSource}
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID, highlightRow) => {

            const d = new Date(item.date)
            const itemIsOverDue = new Date() > d
            const itemIsToday = d.toDateString() == new Date().toDateString()
            const allowRating = itemIsToday || itemIsOverDue
            const formattedDate = this.formatCellDate(d)

            if(allowRating) {
              return (

                <SRTypographicCell
                  onPressDetailsButton={() => this.navigateToDetails(item)}
                  onPressRateButton={() => this.rateItem(item.id)}
                >
                  {{title: item.taskName, notes: item.notes, date: formattedDate}}
                </SRTypographicCell>

              )
            } else {
              return (

                <SRStudyListCell
                  onPressDetailsButton={() => this.navigateToDetails(item)}
                >
                {{title: item.taskName, notes: item.notes, date: formattedDate}}
              </SRStudyListCell>

            )}
          }}
        />

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={ratingModalisVisible}
          >
         <SRRatingView
           dismissAction={() => this.setRatingModalVisible(!ratingModalisVisible)}
           ratedCallback={(index) => this.rateTask(index)}
         />
        </Modal>

      </View>
    )
  }

  // UI state

  _renderEmptyStateHeader = (flag) => {
    if(flag) {
      return (
        <View style={styles.emptyStateHeaderBackground}>
          <View style={styles.circle} />
          <View style={styles.rectangle} />
          <View style={styles.triangleContainer}>
            <View style={styles.triangle} />
          </View>
        </View>
      )
    } else {
      return null
    }
  }

  rateItem = (id: string) => {
    this.setState({selectedID: id})
    this.setRatingModalVisible(true)
  }

  setRatingModalVisible(visible: bool) {
    this.setState({ratingModalisVisible: visible});
  }

  navigateToDetails = (item: any) => {
    const { navigation } = this.props
    const displayProps = {
      readonly: true,
      item: item,
      saveAction: (newItem, oldItem) => this.updateTask(newItem, oldItem),
      deleteAction: () => this.deleteTask(item),
    }
    navigation.navigate(AddStudyTaskScreenName, displayProps)
  }

  //
  // TODO: refactor out of here
  addTask = (task: {taskName: string, notes: string, date: string}) => {
    const {addItem} = this.props
    const {taskName, notes, date} = task

    const studyTask = new SRStudyTask(
      uuid(),
      taskName,
      notes,
      [date],
      [],
      SRStudyTaskIntensity.NORMAL,
      new SRSpacedRepetition(),
    )

    addItem(studyTask)
  }

  updateTask = (newItem, oldItem) => {
    const { replaceItem } = this.props
    const mergedItem = this.dataWithID(oldItem.id)
    mergedItem.taskName = newItem.taskName
    mergedItem.notes = newItem.notes
    replaceItem(mergedItem)
  }

  deleteTask = (task) => {
    const { navigation, removeItem } = this.props
    Alert.alert(
      'Delete Study Task',
      'Are you sure you want to delete the study task? This cannot be undone.',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'Delete', onPress: () => {
          removeItem(task)
          navigation.dispatch(NavigationActions.back())
        }},
      ],
      { cancelable: true }
    )

  }

  //

  dataWithID = (id: string) => {
    expect(id).toExist('dataWithID(): Undefined id')
    const { studyTasks } = this.props
    const filteredArray = studyTasks.filter((item) => item.id == id)
    expect(filteredArray.length).toBe(1, `Looking for data with id: ${id}. Item: ${JSON.stringify(studyTasks)}`)
    const item = filteredArray[0]
    return item
  }

  formatCellDate = (date: string) => {
    const itemIsOverDue = moment(date).isBefore(new Date(), 'day')

    var formattedDate = ''
    const momentDate = moment(date)

    formattedDate = momentDate.calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'D MMM'
    });

    if (itemIsOverDue) {
      const momentFromNow = moment(date)
      momentFromNow.format('dd')
      formattedDate = momentFromNow.fromNow()
    }
    return formattedDate
  }

  rateTask = (index: number) => {
    var grade = ''
    switch(index) {
      case 0:
        grade = SRSGrade.BAD
        break;
      case 1:
        grade = SRSGrade.OK
        break
      case 2:
        grade = SRSGrade.GOOD
        break
      default:
      throw "No valid rating selected"
    }
    const { selectedID, dataSource } = this.state
    expect(selectedID).toExist('rateTask(): undefined id')
    const item = this.dataWithID(selectedID)

    // update SRS, rating history, date rated,
    item.ratingHistory.push(grade)

    const dateRated = new Date().toString()
    item.dates.push(dateRated)

    const { easinessFactor, interval, repetition } = item.srs
    const updatedSRS = new SRSpacedRepetition(easinessFactor, interval, repetition).grade(grade)
    expect(updatedSRS.easinessFactor).toNotEqual(easinessFactor)
    item.srs = updatedSRS

    const { store } = this.props.screenProps
    store.dispatch(actionCreators.replace(item))

    this.setRatingModalVisible(false)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addItem: item => {
      dispatch(actionCreators.add(item))
    },
    removeItem: item => {
      dispatch(actionCreators.remove(item))
    },
    replaceItem: item => {
      dispatch(actionCreators.replace(item))
    }
  }
}

const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SRStudyList)

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  tableViewContainer: {
    paddingBottom: 10,
  },
  tableView: {
    backgroundColor: SRBrightColor,
  },



  emptyStateHeaderBackground: {
    backgroundColor: SRDarkColor,
    padding: 18,
  },
  circle: {
    backgroundColor: SRRedColor,
    borderRadius: 38/2,
    height: 38,
    width: 38
  },
  rectangle: {
    backgroundColor: SRBrightColor,
    height: 85,
    width: 135,
    marginTop:28,
    marginBottom: 16,
  },
  triangleContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 19,
    borderRightWidth: 19,
    borderBottomWidth: 38,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: SRYellowColor
 }
})

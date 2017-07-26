// @flow

import React from 'react'
import {
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

import SRFloatingButton from './SRFloatingButton'
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

const studyListTitle = 'Reviews'

const AddStudyTaskNavigator = StackNavigator({
  SRStudyTaskEditor: { screen: withMappedNavigationProps(SRStudyTaskEditor) }
})

export class SRStudyList extends React.Component {

  static navigationOptions = (props) => {
    return {
      // headerLeft: <Button title='⚙️' onPress={() => params.openSettings()} />,
      tabBarLabel: studyListTitle,
      tabBarIcon: ({ tintColor }) => (
        <Text>🔜</Text>
      ),
      headerTintColor: SRDarkColor,
      headerStyle: {
        backgroundColor: SRBrightColor
      },
      title: studyListTitle,
    }
  }

  state: {
    addTaskModalisVisible: bool,
    dataSource: ListView.DataSource,
    ratingModalisVisible: bool,
    renderEmptyStateHeader: bool,
    selectedID: string,
    studyTasks: Array<any>,
    keepSpinning: bool,
  }

  constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      addTaskModalisVisible: false,
      dataSource: dataSource.cloneWithRows([]),
      ratingModalisVisible: false,
      selectedID: '',
      studyTasks: [],
      renderEmptyStateHeader: false,
      keepSpinning: false,
    };
  }

  componentWillMount() {
    const {studyTasks} = this.props
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(processDataForList(studyTasks))
    })
  }

  componentDidMount() {
    // this.props.navigation.setParams({openSettings: this.openSettings})

  }

  componentWillReceiveProps(newProps: Object) {
    const {studyTasks} = newProps
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(processDataForList(studyTasks))
    })
    this.updateStuff()
  }

  updateStuff = () => {
      const {studyTasks} = this.props
    const { addTaskModalisVisible, dataSource, keepSpinning } = this.state
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
      keepSpinning: noDataYet,
    })
  }

  render() {
    const { addTaskModalisVisible, dataSource, studyTasks, renderEmptyStateHeader, keepSpinning, ratingModalisVisible} = this.state
    const { addItem } = this.props

    const addTaskScreenProps = {
      saveAction: (item) => {
        this.addTask(item)
        this.setAddTaskModalVisible(!addTaskModalisVisible)
      },
      cancelAction: () => this.setAddTaskModalVisible(!addTaskModalisVisible),
      readonly: false,
    }

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

        <View style={styles.floatingButton}>
          <SRFloatingButton
            keepSpinning={keepSpinning}
            style={styles.addTouchable}
            onPress={()=>{
            this.setAddTaskModalVisible(!this.state.addTaskModalisVisible)
          }}>

            <Text style={styles.floatingButtonText}>⬥</Text>

          </SRFloatingButton>
        </View>

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

        <Modal
          animationType={"slide"}
          transparent={false}
          visible={addTaskModalisVisible}
          >
         <AddStudyTaskNavigator screenProps={addTaskScreenProps}/>
        </Modal>

      </View>
    )
  }

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

  setAddTaskModalVisible(visible: bool) {
    this.setState({addTaskModalisVisible: visible})
  }

  navigateToDetails = (item: any) => {
    const { navigation } = this.props
    const displayProps = {
      readonly: true,
      item: item,
      saveAction: (newItem, oldItem) => this.updateTask(newItem, oldItem),
      deleteAction: () => this.deleteTask(item),
    }
    navigation.navigate('SRStudyTaskEditor', displayProps)
  }

  openSettings = () => {

  }

  //
  // TODO: refactor out of here
  addTask = (task: {title: string, notes: string, date: string}) => {
    const {addItem} = this.props
    const {title, notes, date} = task

    const studyTask = new SRStudyTask(
      uuid(),
      title,
      notes,
      [date],
      [],
      SRStudyTaskIntensity.NORMAL,
      new SRSpacedRepetition(),
    )

    addItem(studyTask)
  }

  //

  dataWithID = (id: string) => {
    expect(id).toExist('dataWithID(): Undefined id')
    const { store } = this.props.screenProps
    const { studyTasks } = this.state
    const studyTasksCopy = [...studyTasks]
    const filteredArray = studyTasksCopy.filter((item) => item.id == id)
    expect(filteredArray.length).toBe(1, `Looking for data with id: ${id}. Item: ${JSON.stringify(studyTasksCopy)}`)
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

  rateTask = (index: Number) => {
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
  floatingButton: {
    justifyContent: 'center',
    alignItems: 'stretch',
    position: 'absolute',
    bottom: 15,
    right: 15,
  },
  addTouchable: {
    flex:1,
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(57, 62, 65, 0.9)',
  },
  floatingButtonText: {
    marginBottom: 3,
    fontSize: 20,
    textAlign: 'center',
    color: 'rgba(255, 252, 49, 0.9)',
  },
  emptyStateHeaderBackground: {
    backgroundColor: SRDarkColor,
    // marginBottom: 10,
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

// @flow

import React from 'react'
import {
  Modal,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import expect from 'expect'
import moment from 'moment'
import { actionCreators } from './dataModel/SRSimpleDataModel'
import { SRSpacedRepetition } from './SRSpacedRepetition'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRStudyListCell from './SRStudyListCell'
import SRRatingView from './SRRatingView'
import { SRSGrade } from './SRSpacedRepetition'
import { processDataForList } from './dataModel/SRDataPresenter'
import {SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor} from './utilities/SRColors'
import SRTypographicCell from './SRTypographicCell'

const studyListTitle = 'Reviews'

const AddStudyTaskNavigator = StackNavigator({
  SRStudyTaskEditor: { screen: SRStudyTaskEditor }
  }
)

export default class SRStudyList extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
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

  constructor() {
    super();
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      ratingModalisVisible: false,
      addTaskModalisVisible: false,
    };
  }

  componentWillMount() {
    const {store} = this.props.screenProps

    const {studyTasks} = store.getState()
    this.setState({studyTasks})
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(processDataForList(studyTasks))
    })

    this.unsubscribe = store.subscribe(() => {
      const {studyTasks} = store.getState()
      this.setState({studyTasks})
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(processDataForList(studyTasks))
      })
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount() {
    // this.props.navigation.setParams({openSettings: this.openSettings})
  }

  componentWillReceiveProps(newProps) {

  }

  render() {
    const { dataSource, studyTasks } = this.state
    const addTaskScreenProps = {
      ...this.props.screenProps,
      modalDismissAction: () => this.setAddTaskModalVisible(!this.state.addTaskModalisVisible)
    }
    const tableData = processDataForList(studyTasks)
    var showEmptyStateHeader = false
    if(tableData.length == 0 || (new Date(tableData[0].date) > new Date())) {
      showEmptyStateHeader = true
    }

    return (
      <View style={styles.container}>
        {this._renderEmptyStateHeader(showEmptyStateHeader)}
        <ListView
          style={{backgroundColor: SRBrightColor}}
          dataSource={dataSource}
          enableEmptySections={true}
          renderRow={(item, sectionID, rowID, highlightRow) => {

            const d = new Date(item.date)
            const highlightTasksSinceDate = new Date()
            const itemIsOverDue = highlightTasksSinceDate > d
            const itemIsToday = d.toDateString() == new Date().toDateString()
            const somethingToShowToday = itemIsOverDue || itemIsToday
            const formattedDate = this.formatCellDate(d)

            if(somethingToShowToday) {
              return (

                <SRTypographicCell
                  onPressDetailsButton={() => this.navigateToDetails(item.id)}
                  onPressRateButton={() => {
                    this.setState({selectedID: item.id})
                    this.openRatingUI()
                  }}
                >
                  {{title: item.taskName, notes: item.notes, date: formattedDate}}
                </SRTypographicCell>

              )
            } else {
              return (

                <SRStudyListCell
                  onPressDetailsButton={() => this.navigateToDetails(item.id)}
                >
                {{title: item.taskName, notes: item.notes, date: formattedDate}}
              </SRStudyListCell>

            )}
          }}
        />

        <View style={styles.floatingButton}>
          <TouchableOpacity
            style={styles.addTouchable}
            onPress={()=>{
            this.setAddTaskModalVisible(!this.state.addTaskModalisVisible)
          }}>
          {/* <View> */}
            <Text style={styles.floatingButtonText}>⬥</Text>
          {/* </View> */}
          </TouchableOpacity>
        </View>

        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.ratingModalisVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <SRRatingView
           dismissAction={() => this.setRatingModalVisible(!this.state.ratingModalisVisible)}
           ratedCallback={(index) => this.rateTask(index)}
         />
        </Modal>

        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.addTaskModalisVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
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

  _renderNothingTodayCell = (flag) => {
    if(flag) {
      return(
        <SRTypographicCell hideRateButton='true'>
          {{title: 'Come back later', notes: '🙇‍♀️🙆🙋💁🙅🤷‍♀️🤦‍♀️', date: 'in 2 days'}}
        </SRTypographicCell>
      )
    } else {
      return null
    }
  }

  onAddTodo = (text: string) => {
    const {store} = this.props.screenProps

    store.dispatch(actionCreators.add(text))
  }

  onRemoveTodo = (index: number) => {
    const {store} = this.props.screenProps

    store.dispatch(actionCreators.remove(index))
  }

  openSettings = () => {

  }

  openRatingUI = () => {
    this.setRatingModalVisible(true)
  }

  setRatingModalVisible(visible) {
    this.setState({ratingModalisVisible: visible});
  }

  setAddTaskModalVisible(visible) {
    this.setState({addTaskModalisVisible: visible})
  }

  rateTask = (index) => {
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
        break
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

  navigateToDetails = (id) => {
    const { navigation } = this.props
    expect(id).toExist('navigateToDetails(): Undefined id')
    const item = this.dataWithID(id)
    navigation.navigate('SRStudyTaskEditor', {readonly: true, item: item})
  }

  dataWithID = (id) => {
    expect(id).toExist('dataWithID(): Undefined id')
    const { store } = this.props.screenProps
    const { studyTasks } = this.state
    const studyTasksCopy = [...studyTasks]
    const filteredArray = studyTasksCopy.filter((item) => item.id == id)
    expect(filteredArray.length).toBe(1, `Looking for data with id: ${id}. Item: ${JSON.stringify(studyTasksCopy)}`)
    const item = filteredArray[0]
    return item
  }

  formatCellDate = (date) => {
    const itemIsOverDue = new Date() > date

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
}

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
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
    fontSize: 20,
    textAlign: 'center',
    color: 'rgba(255, 252, 49, 0.9)',
  },
  emptyStateHeaderBackground: {
    backgroundColor: SRDarkColor,
    marginBottom: 10,
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

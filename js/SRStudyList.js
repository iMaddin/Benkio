// @flow

import React from 'react'
import {
  Button,
  Modal,
  SectionList,
  StyleSheet,
  Text,
  View
} from 'react-native'
import { StackNavigator } from 'react-navigation'
import expect from 'expect'
import { actionCreators } from './dataModel/SRSimpleDataModel'
import { SRSpacedRepetition } from './SRSpacedRepetition'
import SRStudyTaskEditor from './SRStudyTaskEditor'
import SRStudyListCell from './SRStudyListCell'
import SRRatingView from './SRRatingView'
import { SRSGrade } from './SRSpacedRepetition'
import { processDataForList } from './dataModel/SRDataPresenter'

const studyListTitle = 'Study List'

export default class SRStudyList extends React.Component {

  static navigationOptions = ({navigation}) => {
    const { params = {} } = navigation.state
    return {
      headerLeft: <Button title='⚙️' onPress={() => params.openSettings()} />,
      tabBarLabel: studyListTitle,
      tabBarIcon: ({ tintColor }) => (
        <Text>🔜</Text>
      ),
      title: studyListTitle,
    }
  }

  state = {
    modalVisible: false,
  }

  componentWillMount() {
    const {store} = this.props.screenProps

    const {studyTasks} = store.getState()
    this.setState({studyTasks})

    this.unsubscribe = store.subscribe(() => {
      const {studyTasks} = store.getState()
      this.setState({studyTasks})
    })
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  componentDidMount() {
    this.props.navigation.setParams({openSettings: this.openSettings})
  }

  render() {
    const {studyTasks} = this.state

    return (
        <View style={styles.container}>
        <SectionList
          sections={processDataForList(studyTasks)}
          // renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderItem={({
            item,
            index,
            section,
            // separators: {
            //   highlight: () => void,
            //   unhighlight: () => void,
            //   updateProps: (select: 'leading' | 'trailing', newProps: Object) => void,
            // },
          }) => {
            return (
              <SRStudyListCell
                canBeRated={true}
                onPressDetailsButton={() => {
                  this.state.selectedID = item.id
                  this.navigateToDetails()
                  }
                }
                onPressRateButton={() => {
                  this.state.selectedID = item.id
                  this.openRatingUI()
                  }
                }
              >
                {{title: item.taskName, notes: item.notes}}
              </SRStudyListCell>
            )
          }}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          keyExtractor={(item, index) => index}
        />
        <Modal
          animationType={"fade"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <SRRatingView
           dismissAction={() => this.setModalVisible(!this.state.modalVisible)}
           ratedCallback={(index) => this.rateTask(index)}
         />

        </Modal>
        </View>
    )
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
    this.setModalVisible(true)
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  rateTask = (index) => {
    var grade = ''
    switch(index) {
      case 0:
        grade = SRSGrade.OK
        break;
      case 1:
        grade = SRSGrade.GOOD
        break
      case 2:
        grade = SRSGrade.PERFECT
        break
      default:
      throw "No valid rating selected"
        break
    }
    const { selectedID } = this.state
    const item = this.dataWithID(selectedID)
    const { easinessFactor, interval, repetition } = item.srs
    const updatedSRS = new SRSpacedRepetition(easinessFactor, interval, repetition).grade(grade)
    item.srs = updatedSRS
    store.dispatch(actionCreators.replace(item))
    this.setModalVisible(false)
  }

  navigateToDetails = () => {
    const { selectedID } = this.state
    const { navigation } = this.props
    const item = this.dataWithID(selectedID)
    navigation.navigate('DetailsView', {readonly: true, item: item})
  }

  dataWithID = (id) => {
    const { store } = this.props.screenProps
    const {studyTasks} = store.getState()
    const filteredArray = studyTasks.filter((item) => item.id == id)
    expect(filteredArray.length).toBe(1)
    const item = filteredArray[0]
    return item
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
  }
})

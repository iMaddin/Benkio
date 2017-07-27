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
import expect from 'expect'
import { connect } from 'react-redux'
import PropTypes from 'prop-types';

import SRRatingView from './SRRatingView'
import SRStudyListCell from './SRStudyListCell'
import SRTypographicCell from './SRTypographicCell'
import { SRSGrade } from './SRSpacedRepetition'
import { processDataForList } from './dataModel/SRDataPresenter'
import { SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor } from './utilities/SRColors'
import { formatCellDate } from './utilities/SRDateFormat'
import SREmptyStateHeader from './components/SREmptyStateHeader'
import SREmptyState from './components/SREmptyState'

export const studyListTitle = 'Reviews'

class SRStudyList extends React.Component {

  state: {
    dataSource: ListView.DataSource,
    ratingModalisVisible: bool,
    renderEmptyStateHeader: bool,
    renderEmptyStateTable: bool,
    emptyStateTableDistanceFromBottom: number,
    selectedID: string,
    listViewHeight: number,
    onlyTypographicCellHeight: number,
  }

  constructor(props: Object) {
    super(props);
    const dataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: dataSource.cloneWithRows([]),
      ratingModalisVisible: false,
      selectedID: '',
      renderEmptyStateHeader: false,
      renderEmptyStateTable: true,
      emptyStateTableDistanceFromBottom: 0,
      listViewHeight: 0,
      onlyTypographicCellHeight: 0,
    }
  }

  componentWillMount() {
    this.updateUIStates(this.props)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {
    const {
      dataSource,
      renderEmptyStateHeader,
      renderEmptyStateTable,
      ratingModalisVisible
    } = this.state

    return (
      <View style={styles.container}>
        {this._renderEmptyStateHeader(renderEmptyStateHeader)}
        <ListView
          contentContainerStyle={styles.tableViewContainer}
          style={styles.tableView}
          dataSource={dataSource}
          enableEmptySections={true}
          onLayout={(event) => {
            const {x, y, width, height} = event.nativeEvent.layout
            console.log(`listViewHeight ${height}`)
            this.setState({listViewHeight: height})
          }}
          renderRow={(item, sectionID, rowID, highlightRow) => {

            const d = new Date(item.date)
            const itemIsOverDue = new Date() > d
            const itemIsToday = d.toDateString() == new Date().toDateString()
            const allowRating = itemIsToday || itemIsOverDue
            const formattedDate = formatCellDate(d)

            if(allowRating) {
              return (
                // needs wrapper because onLayout doesn't get called on SRTypographicCell for some reason
                <View style={{flex:1}}
                  onLayout={(event) => {
                    const {x, y, width, height} = event.nativeEvent.layout
                    if(rowID == 0) {
                      console.log(`onlyTypographicCellHeight ${height}`)
                      this.setState({onlyTypographicCellHeight: height})
                    }
                  }}>
                  <SRTypographicCell
                    onPressDetailsButton={() => this.navigateToDetails(item)}
                    onPressRateButton={() => this.rateItem(item.id)}
                  >
                    {{title: item.taskName, notes: item.notes, date: formattedDate}}
                  </SRTypographicCell>
                </View>
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
        {this._renderEmptyStateTable(renderEmptyStateTable)}
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

  componentDidMount() {
    const { studyTasks } = this.props
    const { listViewHeight, onlyTypographicCellHeight } = this.state

    const tableData = processDataForList(studyTasks)

    const noDataYet = tableData.length == 0
    var emptyStateTableDistanceFromBottomCalculated = 0

    if(noDataYet) {
      emptyStateTableDistanceFromBottomCalculated = listViewHeight/2
    } else {
      const firstItem = tableData[0]
      const onlyFutureTasks = (new Date(firstItem.date) > new Date())
      if(onlyFutureTasks) {
      } else {
        if(tableData.length == 1) {

        }
      }
    }

    emptyStateTableDistanceFromBottomCalculated = listViewHeight - onlyTypographicCellHeight
    console.log(`componentDidMount() emptyStateTableDistanceFromBottomCalculated ${emptyStateTableDistanceFromBottomCalculated}`)

    this.setState({
      emptyStateTableDistanceFromBottom: emptyStateTableDistanceFromBottomCalculated,
    })
  }

  componentDidUpdate(prevProps, prevState) {
    const { listViewHeight, onlyTypographicCellHeight } = this.state
    var emptyStateTableDistanceFromBottomCalculated = listViewHeight - onlyTypographicCellHeight
    console.log(`componentDidUpdate() emptyStateTableDistanceFromBottomCalculated ${emptyStateTableDistanceFromBottomCalculated}`)

    if (listViewHeight != 0 && onlyTypographicCellHeight != 0 && prevState.emptyStateTableDistanceFromBottom != emptyStateTableDistanceFromBottomCalculated) {
      this.setState({
        emptyStateTableDistanceFromBottom: emptyStateTableDistanceFromBottomCalculated,
      })
    }

  }

  // UI state

  updateUIStates = (props) => {
    const { studyTasks } = props
    const { listViewHeight, onlyTypographicCellHeight } = this.state
    const tableData = processDataForList(studyTasks)

    const noDataYet = tableData.length == 0
    var showEmptyStateHeader = false
    var emptyStateTableDistanceFromBottomCalculated = 0

    if(noDataYet) {
      showEmptyStateHeader = true
      emptyStateTableDistanceFromBottomCalculated = listViewHeight/2
    } else {
      const firstItem = tableData[0]
      const onlyFutureTasks = (new Date(firstItem.date) > new Date())
      if(onlyFutureTasks) {
        showEmptyStateHeader = true
      } else {
        if(tableData.length == 1) {
          emptyStateTableDistanceFromBottomCalculated = listViewHeight - onlyTypographicCellHeight
          // console.log(`emptyStateTableDistanceFromBottomCalculated ${emptyStateTableDistanceFromBottomCalculated}`)
        }
      }
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(tableData),
      renderEmptyStateHeader: showEmptyStateHeader,
      emptyStateTableDistanceFromBottom: emptyStateTableDistanceFromBottomCalculated,
    })

    // empty state table
    /**
     * no data - table/2
     * 1 today or overdue data - calculate space below typographic cell
     */
  }

  _renderEmptyStateHeader = (flag) => {
    if(flag) {
      return (
        <SREmptyStateHeader />
      )
    } else {
      return null
    }
  }

  _renderEmptyStateTable = (flag) => {
    if(flag) {
      return (
        <View style={{
          position: 'absolute',
          alignItems: 'center',
          right: 0,
          left: 0,
          bottom: this.state.emptyStateTableDistanceFromBottom,
          backgroundColor: 'red',
        }}>
          <SREmptyState style={{
            // flex:1,
            // justifyContent: 'center',
            // alignItems: 'center',
          }}/>
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

  rateTask = (index: number) => {
    var grade = -1
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
    const { rateAction } = this.props
    const { selectedID } = this.state
    rateAction(selectedID, grade)
    this.setRatingModalVisible(false)
  }

  navigateToDetails = (item: any) => {
    const { navigationAction } = this.props
    navigationAction(item)
  }

}

SRStudyList.propTypes = {
  rateAction: PropTypes.func,
  navigationAction: PropTypes.func,
}

const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

export default connect(mapStateToProps)(SRStudyList)

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
})

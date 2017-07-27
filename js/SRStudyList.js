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

export const studyListTitle = 'Reviews'

class SRStudyList extends React.Component {

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
    this.updateUIStates(this.props)
  }

  componentWillReceiveProps(newProps: Object) {
    this.updateUIStates(newProps)
  }

  render() {
    const {
      dataSource,
      renderEmptyStateHeader,
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
          renderRow={(item, sectionID, rowID, highlightRow) => {

            const d = new Date(item.date)
            const itemIsOverDue = new Date() > d
            const itemIsToday = d.toDateString() == new Date().toDateString()
            const allowRating = itemIsToday || itemIsOverDue
            const formattedDate = formatCellDate(d)

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

  updateUIStates = (props) => {
    const { studyTasks } = props
    const tableData = processDataForList(studyTasks)

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(tableData)
    })

    var showEmptyStateHeader = false
    const noDataYet = tableData.length == 0

    if(noDataYet) {
      showEmptyStateHeader = true
    } else {
      const firstItem = tableData[0]
      const onlyFutureTasks = (new Date(firstItem.date) > new Date())
      if(onlyFutureTasks) {
        showEmptyStateHeader = true
      }
    }

    this.setState({
      renderEmptyStateHeader: showEmptyStateHeader,
    })
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

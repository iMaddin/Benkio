// @flow
import React from 'react'
import { Button, StyleSheet, Text, TouchableOpacity, TouchableHighlight, View } from 'react-native'
import {SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor} from './utilities/SRColors'

const taskTextColor = 'rgb(42, 42, 42)'

export default class SRStudyListCell extends React.Component {

  render() {
    const { children, onPressDetailsButton } = this.props

    return (
      <View style={styles.cell}>

        <TouchableHighlight
          style={styles.cellButton}
          underlayColor={'rgb(140, 140, 140)'}
          onPress={onPressDetailsButton}
        >
          <View style={styles.cellData}>
            <Text style={styles.title}>{children.title}</Text>
            <Text style={styles.date}>{children.date}</Text>
          </View>

        </TouchableHighlight>

      </View>
    )
  }

}

SRStudyListCell.defaultProps = {
  onPressDetailsButton: () => any,
  onPressRateButton: () => any,
  // canBeRated: bool,
  // style: ?StyleSheet,
}

const styles = StyleSheet.create({
  cell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderColor: '#F6F7EB',
    borderWidth: 1,
    backgroundColor: 'white',
    marginRight: 15,
    marginLeft: 15,
    marginTop: 6,
    marginBottom: 6,
  },
  cellButton: {
    flex:1,
  },
  cellData: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 54,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    // height: 44,
    color: SRDarkColor,
  },
  date: {
    textAlign: 'right',
  },
})

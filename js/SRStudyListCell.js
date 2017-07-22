// @flow
import React from 'react'
import { Button, StyleSheet, Text, TextView, TouchableOpacity, TouchableHighlight, View } from 'react-native'

const taskTextColor = 'rgb(42, 42, 42)'

export default class SRStudyListCell extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      // canBeRated: true
    }
  }

  render() {
    const { canBeRated, children, onPressDetailsButton, style } = this.props
    // const {  } = this.state

    return (
      <View style={styles.cell}>
        {this._renderRateButton()}
        <TouchableHighlight
          style={styles.cellButton}
          underlayColor={'rgb(140, 140, 140)'}
          onPress={onPressDetailsButton}
        >
          <View style={styles.cellData}>
            <Text style={styles.title}>{children.title}</Text>
            {this._renderNotes()}
          </View>
        </TouchableHighlight>

      </View>
    )
  }

  _renderNotes = () => {
    const { notes } = this.props.children
    if (notes != null) {
      return <Text style={styles.notes}>{notes}</Text>
    } else {
      return null
    }
  }

  _renderRateButton = () => {
    if (this.props.canBeRated) {
      return(
        <View style={styles.ratingParent}>
          <TouchableOpacity
            name='rateButton' style={styles.ratingButton}
            onPress={this.props.onPressRateButton}>
            <Text style={styles.ratingContent}>⭐️</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return null
    }
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
  },
  cellButton: {
    flex:1,
  },
  ratingParent: {
    width: 44,
  },
  ratingButton: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingContent: {
  },
  cellData: {
    flex:1,
    padding: 10,
  },
  title: {
    fontSize: 18,
    height: 44,
    color: taskTextColor,
  },
  notes: {
    fontSize: 12,
    color: 'rgb(189, 189, 189)',
  }
})

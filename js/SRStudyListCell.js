import React from 'react'
import { Button, StyleSheet, Text, TextView, View } from 'react-native'

export default class SRStudyListCell extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      canBeRated: true // TODO: set false
    }
  }

  render() {
    const { children, onPressDetailsButton, style } = this.props
    const { canBeRated } = this.state

    return (
      <View>
        {this._renderRateButton()}
        <Button style={styles.title} title={children.title} onPress={onPressDetailsButton}/>
        {this._renderNotes()}
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
    if (this.state.canBeRated) {
      return <Button name='rateButton' title='⭐️' onPress={this.props.onPressRateButton}/>
    } else {
      return null
    }
  }

}

SRStudyListCell.defaultProps = {
  onPressDetailsButton: () => any,
  onPressRateButton: () => any,
  // style: ?StyleSheet,
}

const styles = StyleSheet.create({
  title: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  notes: {
    fontSize: 12,
    color: 'rgb(189, 189, 189)',
  }
})

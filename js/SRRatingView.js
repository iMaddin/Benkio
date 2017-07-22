// @flow
import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

// const width = 400
// const height = 250

export default class SRRatingView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <View style={styles.transparentView}>
       <View style={styles.overlayView}>
         <View style={styles.contentView}>
           <Text>Hello World!</Text>

           <TouchableHighlight onPress={() => {
             {this.cancelAction()}
           }}>
             <Text style={styles.cancelButton}>Cancel</Text>
           </TouchableHighlight>
         </View>
       </View>
      </View>
    )
  }

  rated(indexPressed) {
    const {ratedCallback} = this.props
    if (typeof ratedCallback == 'function') {
      ratedCallback(indexPressed)
    }
  }

  cancelAction() {
    const { dismissAction } = this.props
    if (typeof dismissAction == 'function') {
      dismissAction()
    }
  }

}

const styles = StyleSheet.create({
  transparentView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'blackrgba(4, 4, 4, 0.77)',
  },
  overlayView: {
    padding: 15,
    flex: 1,
    height: 240,// TODO: calculate right height
    backgroundColor: 'azure',
    borderRadius: 8,
  },
  contentView: {

  },
  cancelButton: {

  },
  ratingBox: {

  },
  ratingTitle: {

  },
})

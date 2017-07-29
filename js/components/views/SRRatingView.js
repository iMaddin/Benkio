// @flow
import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

import {SRDarkColor, SRYellowColor, SRBrightColor, SRRedColor} from '../../utilities/SRColors'

export default class SRRatingView extends React.Component {

  render() {
    return (
     <View style={styles.overlayView}>
       <View style={styles.contentView}>
         <Text style={styles.ratingBoxTitle}>How well did you do?</Text>

         <View style={styles.ratingBoxContainer}>

             <TouchableHighlight
               style={styles.ratingTouchable}
               underlayColor={'rgba(0, 0, 0, 0.06)'}
               onPress={() => {
                 this.rated(0)
               }}>
                  <View style={[styles.ratingBox, styles.ratingLeft]}>
                    <Text style={[styles.ratingTitle, styles.ratingLeftTitle]}>Bad</Text>
                  </View>
             </TouchableHighlight>

             <TouchableHighlight
               style={styles.ratingTouchable}
               underlayColor={'rgba(0, 0, 0, 0.06)'}
               onPress={() => {
                 this.rated(1)
               }}>
                  <View style={[styles.ratingBox, styles.ratingCenter]}>
                    <Text style={[styles.ratingTitle, styles.ratingCenterTitle]}>Okay</Text>
                  </View>
             </TouchableHighlight>

             <TouchableHighlight
               style={styles.ratingTouchable}
               underlayColor={'rgba(0, 0, 0, 0.06)'}
               onPress={() => {
                 this.rated(2)
               }}>
                  <View style={[styles.ratingBox, styles.ratingRight]}>
                    <Text style={[styles.ratingTitle, styles.ratingRightTitle]}>Good</Text>
                  </View>
             </TouchableHighlight>
         </View>

         <TouchableHighlight
           underlayColor={'rgba(0, 0, 0, 0.06)'}
           onPress={() => {
           {this.cancelAction()}
         }}>
           <Text style={styles.cancelButton}>Cancel</Text>
         </TouchableHighlight>
       </View>
     </View>
    )
  }

  rated(indexPressed: number) {
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
    backgroundColor: 'rgba(4, 4, 4, 0.77)',
  },
  overlayView: {
    padding: 15,
    // flex: 1,
    height: 240,// TODO: calculate right height
    backgroundColor: SRBrightColor,
    borderRadius: 8,
  },
  contentView: {
    flex: 1,
  },
  ratingBoxContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  ratingBox: {
    flex: 1,
    margin: 5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBoxTitle: {
    color: SRDarkColor,
    fontSize: 20,
    textAlign: 'center',
    padding: 10,
  },
  cancelButton: {
    textAlign: 'center',
    fontSize: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  ratingLeft: {
    backgroundColor: SRRedColor,
  },
  ratingCenter: {
    backgroundColor: SRYellowColor,
  },
  ratingRight: {
    backgroundColor: SRDarkColor,
  },
  ratingTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  ratingTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  ratingLeftTitle: {
    color: SRBrightColor,
  },
  ratingCenterTitle: {
    color: SRDarkColor
  },
  ratingRightTitle: {
    color: SRBrightColor,
  },
})

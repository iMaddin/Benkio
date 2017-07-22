// @flow
import React from 'react'
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';

const width = 400
const height = 250

export default class SRRatingView extends React.Component {

  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'flex-end'}}>
       <View style={{height: 100, backgroundColor: 'red'}}>
         <Text>Hello World!</Text>

         <TouchableHighlight onPress={() => {
           {this.cancelAction()}
         }}>
           <Text>Hide Modal</Text>
         </TouchableHighlight>

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

})

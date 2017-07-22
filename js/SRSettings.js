// @flow
import React from 'react'
import { Modal, Text, TouchableHighlight, View } from 'react-native';
import SRRatingView from './SRRatingView'

export const tintColor = '#48BEE0'

export default class SRSettings extends React.Component {

  static navigationOptions = {
    tabBarLabel: 'Settings',
    tabBarIcon: ({ tintColor }) => (
      <Text>⚙️</Text>
    ),
  }

  state = {
    modalVisible: false,
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount() {
    this.setModalVisible(!this.state.modalVisible)
  }

  render() {

    return (
      <View style={{marginTop: 22}}>
        <Modal
          animationType={"slide"}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {alert("Modal has been closed.")}}
          >
         <SRRatingView
            dismissAction={() => this.setModalVisible(!this.state.modalVisible)}
         />

        </Modal>

        <TouchableHighlight onPress={() => {
          this.setModalVisible(true)
        }}>
          <Text>Show Modal</Text>
        </TouchableHighlight>

      </View>
    )
  }

}

import React from 'react'
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View
} from 'react-native'

const intensityOptions = {
  NORMAL: 'NORMAL',
  CUSTOM: 'CUSTOM', // allow user to choose by when something should be learned
}

export default class SRStudyTaskEditor extends React.Component {
  // props: {
  //   taskName: '',
  //   notes: '',
  //   dates: '',
  //   intensity: intensityOptions.NORMAL,
  // };

  render() {
    const { taskName, notes, dates, intensity } = this.props

    return (
      <ScrollView>
        <TextInput
          // style={}
          placeholder="Study Task"
        />
        <TextInput
          // style={}
          placeholder="Notes"
        />
        <Text>Date</Text>
        <Text>Intensity</Text>
        <Button
          title='Save'
          onPress={()=>({

          })}
        />
      </ScrollView>
    );
  }

}

import React from 'react'
import {
  Button,
  Keyboard,
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

  props: {
    taskName: ?string,
    notes: ?string,
    dates: ?string,
    intensity: ?intensityOptions,
    saveAction: (studyTask) => any,
  };

  saveButtonAction = () => {
    const { studyTaskName } = this.state
    this.props.saveAction(studyTaskName);
  }

  render() {
    const { taskName, notes, dates, intensity } = this.props

    return (
      <ScrollView style={styles.scrollView}>
        <View style={styles.edgePadding}>
          <TextInput
            style={styles.dataInputItemPadding}
            placeholder="Study Task"
            onSubmitEditing={Keyboard.dismiss}
            onChangeText={(studyTaskName) => this.setState({studyTaskName})}
          />
          <TextInput
            style={styles.dataInputItemPadding}
            placeholder="Notes"
            onSubmitEditing={Keyboard.dismiss}
          />
          <Text style={styles.dataInputItemPadding}>Date</Text>
          <Text style={styles.dataInputItemPadding}>Intensity</Text>
          <Button
            style={styles.dataInputItemPadding}
            title='Save'
            onPress={this.saveButtonAction}
          />
        </View>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingTop: 44,
  },
  edgePadding: {
    padding: 15,
    flex:1,
  },
  dataInputItemPadding: {
    padding: 5,
  }
});

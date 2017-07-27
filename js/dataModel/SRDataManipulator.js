// @flow
import { connect } from 'react-redux'

import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './SRSimpleDataModel'
import uuid from '../utilities/UUID'
import SRSpacedRepetition from '../SRSpacedRepetition'

const addTask = (task: {taskName: string, notes: string, date: string}) => {
  const { taskName, notes, date } = task

  const studyTask = new SRStudyTask(
    uuid(),
    taskName,
    notes,
    [date],
    [],
    SRStudyTaskIntensity.NORMAL,
    new SRSpacedRepetition(),
  )

  return studyTask
}

export const mapDispatchToProps = dispatch => {

  return {
    addItem: item => {
      const task = addTask(item)
      dispatch(actionCreators.add(task))
    },
    removeItem: item => {
      dispatch(actionCreators.remove(item))
    },
    replaceItem: item => {
      dispatch(actionCreators.replace(item))
    },
  }
}

export const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

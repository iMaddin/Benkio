// @flow
import { actionCreators, SRStudyTask, SRStudyTaskIntensity } from './SRSimpleDataModel'
import uuid from '../utilities/UUID'
import SRSpacedRepetition from '../SRSpacedRepetition'
import { connect } from 'react-redux'
import expect from 'expect'

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

const updateTask = (
  newTask: {id: string, taskName: string, notes: string, date: string},
  oldTask: {id: string, taskName: string, notes: string, date: string},
  studyTasks: Array<Object>
) => {
  const mergedItem = dataWithID(oldTask.id, studyTasks)
  mergedItem.taskName = newTask.taskName
  mergedItem.notes = newTask.notes
  return mergedItem
}

const rateTask = (id: string, grade: number, studyTasks: Array<Object>) => {
  expect(id).toExist('rateItem(): undefined id')
  const item = dataWithID(id, studyTasks)

  // update SRS, rating history, date rated,
  item.ratingHistory.push(grade)

  const dateRated = new Date().toString()
  item.dates.push(dateRated)

  const { easinessFactor, interval, repetition } = item.srs
  const updatedSRS = new SRSpacedRepetition(easinessFactor, interval, repetition).grade(grade)
  item.srs = updatedSRS

  return item
}

const dataWithID = (id: string, studyTasks: Array<Object>) => {
  expect(id).toExist('dataWithID(): Undefined id')
  const filteredArray = studyTasks.filter((item) => item.id == id)
  expect(filteredArray.length).toBe(1, `Looking for data with id: ${id}. Item: ${JSON.stringify(studyTasks)}`)
  const item = filteredArray[0]
  return item
}

export const mapDispatchToProps = (dispatch, props) => {
  const { studyTasks } = props

  return {
    addItem: item => {
      const task = addTask(item)
      dispatch(actionCreators.add(task))
    },
    removeItem: item => {
      dispatch(actionCreators.remove(item))
    },
    replaceItem: (newTask, oldTask) => {
      const updatedTask = updateTask(newTask, oldTask, studyTasks)
      dispatch(actionCreators.replace(updatedTask))
    },
    rateItem: (id, grade) => {
      const ratedTask = rateTask(id, grade, studyTasks)
      dispatch(actionCreators.replace(ratedTask))
    }
  }
}

export const mapStateToProps = (state) => {
    return {
        studyTasks: state.studyTasks
    }
}

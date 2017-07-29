// @flow
import SRSpacedRepetition from '../utilities/SRSpacedRepetition'
import expect from 'expect'
import mockData from './mockData.json'

export const SRStudyTaskIntensity = {
  NORMAL: 'NORMAL'
}

// TODO: refactor into own file
export function SRStudyTask(
  id: string,
  taskName: string,
  notes: ?string,
  dates: Array<string> = [new Date().toDateString()],
  ratingHistory: Array<string> = [],
  intensity: string,
  srs: SRSpacedRepetition,
) {
  this.id = id,
  this.taskName = taskName,
  this.notes = notes,
  this.dates = dates,
  this.ratingHistory = ratingHistory,
  this.intensity = intensity,
  this.srs = srs
}

// Define action types
const types = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  REPLACE: 'REPLACE'
}

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
  add: (item: SRStudyTask) => {
    return {type: types.ADD, payload: item}
  },
  remove: (item: Object) => {
    return {type: types.REMOVE, payload: item}
  },
  replace: (item: SRStudyTask) => {
    return {type: types.REPLACE, payload: item}
  }
}

// Initial state of the store
// const initialState = mockData
const initialState = {studyTasks:[]}

export const reducer = (state: Object = initialState, action: { type: string, payload: any}) => {
  const {studyTasks} = state
  const {type, payload} = action

  switch (type) {
    case types.ADD: {
      return {
        studyTasks: [payload, ...studyTasks],
      }
    }
    case types.REMOVE: {
      const studyTasksCopy = [...studyTasks]
      const newStudyTasks = studyTasks.filter((item) => item.id !== payload.id)
      return {
        studyTasks: newStudyTasks
      }
    }
    case types.REPLACE: {
      const studyTasksCopy = [...studyTasks]
      const index = studyTasksCopy.findIndex((item) => item.id == payload.id)
      if (index >= 0) {
        studyTasksCopy.splice(index, 1, payload)
      }
      // TODO: bug here? ⬇️ is studyTasks modified correctly before replace occurs?
      // expect(studyTasksCopy).toNotEqual(studyTasks, `Payload: ${JSON.stringify(payload)}. studyTasksCopy: ${JSON.stringify(studyTasks)}`)
      return {
        studyTasks: studyTasksCopy
      }
    }
  }

  return state
}

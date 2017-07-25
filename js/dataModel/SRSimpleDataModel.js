// @flow
import { SRSpacedRepetition } from '../SRSpacedRepetition'
import expect from 'expect'
import mockData from './mockData.json'

export const SRStudyTaskIntensity = {
  NORMAL: 'NORMAL'
}

export function SRStudyTask(
  id: string,
  taskName: string,
  notes: ?string,
  dates: Array<string> = [new Date().toDateString()],
  ratingHistory: Array<string> = [],
  srs: SRSpacedRepetition,
  intensity: typeof(SRStudyTaskIntensity)
) {
  this.id = id,
  this.taskName = taskName,
  this.notes = notes,
  this.dates = dates,
  this.ratingHistory = ratingHistory
  this.srs = srs,
  this.intensity = intensity
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
  remove: (id: String) => {
    return {type: types.REMOVE, payload: id}
  },
  replace: (item: SRStudyTask) => {
    return {type: types.REPLACE, payload: item}
  }
}

// Initial state of the store
// const initialState = mockData
const initialState = {studyTasks:[]}

export const reducer = (state: object = initialState, action: { type: string, payload: any}) => {
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
      expect(newStudyTasks).toNotEqual(studyTasksCopy, `payload.id: ${payload.id}`)
      return {
        studyTasks: newStudyTasks
      }
    }
    case types.REPLACE: {
      const studyTasksCopy = [...studyTasks]
      expect(studyTasksCopy.length).toNotEqual(0,'Replacing when there is nothing')
      const index = studyTasksCopy.findIndex((item) => item.id == payload.id)
      expect(index).toBeGreaterThanOrEqualTo(0, 'Nothing found to replace.')
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

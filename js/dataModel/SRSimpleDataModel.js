// @flow
import { SRSpacedRepetition } from '../SRSpacedRepetition'
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
  REMOVE: 'REMOVE'
}

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
  add: (item: SRStudyTask) => {
    return {type: types.ADD, payload: item}
  },
  remove: (index: number) => {
    return {type: types.REMOVE, payload: index}
  }
}

// Initial state of the store
const initialState = mockData

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
      return {
        studyTasks: studyTasks.filter((task, i) => i !== payload),
      }
    }
  }

  return state
}

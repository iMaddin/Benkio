// @flow

import mockData from './mockData.json'

// Initial state of the store
const initialState = mockData

// Define action types
const types = {
  ADD: 'ADD',
  REMOVE: 'REMOVE'
}

// Helper functions to dispatch actions, optionally with payloads
export const actionCreators = {
  add: (item: object) => {
    return {type: types.ADD, payload: item}
  },
  remove: (index: number) => {
    return {type: types.REMOVE, payload: index}
  }
}

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

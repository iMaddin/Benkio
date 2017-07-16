// @flow
import { createStore } from 'redux';
import expect, { createSpy, spyOn, isSpy } from 'expect';

const mockJSON = {
  studyTaskName: 'Te-form',
  notes: '',
  dates: {
    'October 13, 2014 11:13:00',
  },
  intensity: 'Normal'
};

export const modelReducer = (state = [], action) => {
  switch(action.type) {
    case 'ADD_TASK':
      return [
        ...state,
        {
          id: action.id,
          studyTaskName: action.studyTaskName,
          completed: false
        }
      ]
    case 'REMOVE_TASK':
      return state
    default:
      return state
  }
};

const testAddTask = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TASK',
    id: 0,
    studyTaskName: 'Te-form'
  };
  const stateAfter = [
    {
      id: 0,
      studyTaskName: 'Te-form',
      complete: false
    }
  ];

  expect(
    modelReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

testAddTask();
console.log("All tests passed");

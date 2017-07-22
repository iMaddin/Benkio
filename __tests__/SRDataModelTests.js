// @flow
import { reducer } from '../js/dataModel/SRSimpleDataModel'
import { actionCreators } from '../js/dataModel/SRSimpleDataModel'
import mockData from '../js/dataModel/mockData.json'

test('Adding first task', () => {
  const stateBefore = {studyTasks:[]}
  const action = actionCreators.add({
    id: 'randomID',
    taskName: '🇯🇵📖',
    notes: 'p23',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'
  })
  const stateAfter = {studyTasks: [
    {
    id: 'randomID',
    taskName: '🇯🇵📖',
    notes: 'p23',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'}
  ]}
  expect(reducer(stateBefore, action)).toEqual(stateAfter)
})

test('Adding to existing task', () => {
  const stateBefore = {studyTasks: [
    {
    id: 'randomID',
    taskName: '🇯🇵📖',
    notes: 'p23',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'}
  ]}
  const action = actionCreators.add({
    id: 'anotherRandomID',
    taskName: '🚀',
    notes: '',
    dates: ['July 25, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'
  })
  const stateAfter = {studyTasks: [
    {
      id: 'anotherRandomID',
      taskName: '🚀',
      notes: '',
      dates: ['July 25, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'
    },
    {
    id: 'randomID',
    taskName: '🇯🇵📖',
    notes: 'p23',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'}
  ]}
  expect(reducer(stateBefore, action)).toEqual(stateAfter)
})

test('Reading mockData.json', () => {
  const { studyTasks } = mockData
  expect(Array.isArray(studyTasks)).toEqual(true)
})

test('Dates array always contains 1 more item than ratingHistory', () => {

})

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

test('Replace data with same id', () => {
  const stateBefore = {studyTasks: [
    {
    id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
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

  const action = actionCreators.replace({
    id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
    taskName: '🌍☄️🏃🚀',
    notes: 'p143',
    dates: ['November 23, 2018 04:23:32'],
    ratingHistory: [],
    srs: {
      easinessFactor: 1.7,
      interval: 4,
      repetition: 5
    },
    intensity: 'custom'
    })

  const expectedState = {studyTasks: [
    {
    id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
    taskName: '🌍☄️🏃🚀',
    notes: 'p143',
    dates: ['November 23, 2018 04:23:32'],
    ratingHistory: [],
    srs: {
      easinessFactor: 1.7,
      interval: 4,
      repetition: 5
    },
    intensity: 'custom'
    }
  ]}

  expect(reducer(stateBefore, action)).toEqual(expectedState)
})

test('Replace data when no matching id', () => {
  const stateBefore = {studyTasks: [
    {
    id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
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

  const action = actionCreators.replace({
    id: '3ecff790-193f-5977-b88e-c646d30f099b',
    taskName: '🌍☄️🏃🚀',
    notes: 'p143',
    dates: ['November 23, 2018 04:23:32'],
    ratingHistory: [],
    srs: {
      easinessFactor: 1.7,
      interval: 4,
      repetition: 5
    },
    intensity: 'custom'
  })

  const expectedState = {studyTasks: [
    {
    id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
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

  expect(reducer(stateBefore, action)).toEqual(expectedState)
})

test('Replace data when empty state', () => {
  const stateBefore = {studyTasks: []}
  const action = actionCreators.replace({
    id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
    taskName: '🌍☄️🏃🚀',
    notes: 'p143',
    dates: ['November 23, 2018 04:23:32'],
    ratingHistory: [],
    srs: {
      easinessFactor: 1.7,
      interval: 4,
      repetition: 5
    },
    intensity: 'custom'
  })
  const expectedState = {studyTasks: []}

  expect(reducer(stateBefore, action)).toEqual(expectedState)
})

test('Replace data without affecting other items', () => {
  const stateBefore = {studyTasks: [
    {
    id: '1b6ac453-bb13-516e-b60e-28e1dbffa30d',
    taskName: 'zuO$k9$]n',
    notes: 'P@d^$Vp8q**',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'},
    {
    id: '32[uEkOPWGh',
    taskName: 'MGlp@fue5RpW]^Z4ZBhc',
    notes: '^qOh7OTdB!g2AcfC',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'},
    {
    id: 'DkA!kPT!Ynvu4R4xDUH',
    taskName: '🇯7xH$)s]ltHp8hNZC',
    notes: 'HSx@6YXYid&8qPti%O6',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'},
    {
    id: 'co8rBPB]5PQ9zvUKz',
    taskName: 'C13i4c%EIn1AJ8@',
    notes: 'pXv*DFROxN9v',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'}
  ]}

  const action = actionCreators.replace({
    id: '32[uEkOPWGh',
    taskName: '🌍☄️🏃🚀',
    notes: 'p143',
    dates: ['November 23, 2018 04:23:32'],
    ratingHistory: [],
    srs: {
      easinessFactor: 1.7,
      interval: 4,
      repetition: 5
    },
    intensity: 'custom'
  })

  const expectedState = {studyTasks: [
    {
    id: '1b6ac453-bb13-516e-b60e-28e1dbffa30d',
    taskName: 'zuO$k9$]n',
    notes: 'P@d^$Vp8q**',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'},
    {
    id: '32[uEkOPWGh',
    taskName: '🌍☄️🏃🚀',
    notes: 'p143',
    dates: ['November 23, 2018 04:23:32'],
    ratingHistory: [],
    srs: {
      easinessFactor: 1.7,
      interval: 4,
      repetition: 5
    },
    intensity: 'custom'},
    {
    id: 'DkA!kPT!Ynvu4R4xDUH',
    taskName: '🇯7xH$)s]ltHp8hNZC',
    notes: 'HSx@6YXYid&8qPti%O6',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'},
    {
    id: 'co8rBPB]5PQ9zvUKz',
    taskName: 'C13i4c%EIn1AJ8@',
    notes: 'pXv*DFROxN9v',
    dates: ['July 19, 2017 11:13:00'],
    ratingHistory: [],
    srs: {
      easinessFactor: 2.5,
      interval: 0,
      repetition: 0
    },
    intensity: 'normal'}
  ]}

  expect(reducer(stateBefore, action)).toEqual(expectedState)
})

test('Delete task from single content array', () => {
    const stateBefore = {studyTasks: [
      {
        id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
        taskName: '🌍☄️🏃🚀',
        notes: 'p143',
        dates: ['November 23, 2018 04:23:32'],
        ratingHistory: [],
        srs: {
          easinessFactor: 1.7,
          interval: 4,
          repetition: 5
        },
        intensity: 'custom'
      }
    ]}
    const action = actionCreators.remove({
      id: '656ac0ea-dfc8-5321-bc4d-1d25342c830c',
    })
    const expectedState = {studyTasks:[]}
    expect(reducer(stateBefore, action)).toEqual(expectedState)
})

test('Delete task', () => {
    const stateBefore = {studyTasks: [
      {
      id: '1b6ac453-bb13-516e-b60e-28e1dbffa30d',
      taskName: 'zuO$k9$]n',
      notes: 'P@d^$Vp8q**',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'},
      {
      id: '32[uEkOPWGh',
      taskName: '🌍☄️🏃🚀',
      notes: 'p143',
      dates: ['November 23, 2018 04:23:32'],
      ratingHistory: [],
      srs: {
        easinessFactor: 1.7,
        interval: 4,
        repetition: 5
      },
      intensity: 'custom'},
      {
      id: 'DkA!kPT!Ynvu4R4xDUH',
      taskName: '🇯7xH$)s]ltHp8hNZC',
      notes: 'HSx@6YXYid&8qPti%O6',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'},
      {
      id: 'co8rBPB]5PQ9zvUKz',
      taskName: 'C13i4c%EIn1AJ8@',
      notes: 'pXv*DFROxN9v',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'}
    ]}
    const action = actionCreators.remove({
      id: 'DkA!kPT!Ynvu4R4xDUH',
    })
    const expectedState = {studyTasks: [
      {
      id: '1b6ac453-bb13-516e-b60e-28e1dbffa30d',
      taskName: 'zuO$k9$]n',
      notes: 'P@d^$Vp8q**',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'},
      {
      id: '32[uEkOPWGh',
      taskName: '🌍☄️🏃🚀',
      notes: 'p143',
      dates: ['November 23, 2018 04:23:32'],
      ratingHistory: [],
      srs: {
        easinessFactor: 1.7,
        interval: 4,
        repetition: 5
      },
      intensity: 'custom'},
      {
      id: 'co8rBPB]5PQ9zvUKz',
      taskName: 'C13i4c%EIn1AJ8@',
      notes: 'pXv*DFROxN9v',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'}
    ]}
    expect(reducer(stateBefore,action)).toEqual(expectedState)
})

test('Delete without matching id', () => {
    const stateBefore = {studyTasks: [
      {
      id: '1b6ac453-bb13-516e-b60e-28e1dbffa30d',
      taskName: 'zuO$k9$]n',
      notes: 'P@d^$Vp8q**',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'},
      {
      id: '32[uEkOPWGh',
      taskName: '🌍☄️🏃🚀',
      notes: 'p143',
      dates: ['November 23, 2018 04:23:32'],
      ratingHistory: [],
      srs: {
        easinessFactor: 1.7,
        interval: 4,
        repetition: 5
      },
      intensity: 'custom'},
      {
      id: 'DkA!kPT!Ynvu4R4xDUH',
      taskName: '🇯7xH$)s]ltHp8hNZC',
      notes: 'HSx@6YXYid&8qPti%O6',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'},
      {
      id: 'co8rBPB]5PQ9zvUKz',
      taskName: 'C13i4c%EIn1AJ8@',
      notes: 'pXv*DFROxN9v',
      dates: ['July 19, 2017 11:13:00'],
      ratingHistory: [],
      srs: {
        easinessFactor: 2.5,
        interval: 0,
        repetition: 0
      },
      intensity: 'normal'}
    ]}
    const action = actionCreators.remove({
      id: '%ykuui7$Ioc'
    })
    const expectedState = stateBefore
    expect(reducer(stateBefore,action)).toEqual(expectedState)
})

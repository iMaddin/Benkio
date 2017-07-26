// @flow
import SRSpacedRepetition from '../SRSpacedRepetition'

import moment from 'moment'
import expect, { createSpy, spyOn, isSpy } from 'expect'

export const processDataForList = (studyTasks) => {
  const itemArray = studyTasks.map(itemWithCalculatedDueDate)
  const listReadyArray = itemArray.sort((a,b) => {
    return new Date(a.date) - new Date(b.date)
  })

  return listReadyArray // id: string, taskName: string, notes: string, date: string}
}

const itemWithCalculatedDueDate = (singleTask) => {
    const { id, taskName, notes, dates, srs } = singleTask
    const { easinessFactor, interval, repetition } = srs
    const srsData = new SRSpacedRepetition(easinessFactor, interval, repetition)
    const nextDueDate = srsData.nextDate(dates[dates.length-1])
    return {
      id: id,
      taskName: taskName,
      notes: notes,
      date: nextDueDate
    }
}

const groupItemsByDate = (itemArray) => {
  var resultArray = []

  itemArray.forEach((item) => {
    const { id, taskName, notes, date } = item
    resultArray = addItemToArrayMatchingDate(resultArray, item)
  })

  return resultArray
}

const addItemToArrayMatchingDate = (array, item) => {
  var arrayCopy = [...array]
  const { id, taskName, notes, date } = item
  const dateObject = new Date(date)
  var foundExistingDateGroup = false

  // search if resultArray already has object with that date
  arrayCopy.forEach((section) => {
    const { dateGroup, items } = section
    const dateWithoutTimeObject = new Date(dateGroup)

    // compare dates, if dates match the day, then group
    if(dateWithoutTimeObject.toDateString() == dateObject.toDateString()) { // adds new tasks to existing date group
      section.items = [...items, {id: id, taskName: taskName, notes: notes, date: date}]
      foundExistingDateGroup = true
      return
    }
  })

  // creates new date group
  if (arrayCopy.length == 0 || !foundExistingDateGroup) {
    arrayCopy = [...arrayCopy, {
      dateGroup: dateObject.toDateString(),
      items: [{id: id, taskName: taskName, notes: notes, date: date}]
    }]
  }

  return arrayCopy
}

const sortByDate = (itemsGroupedByDateArray) => {
  const sortedByDateGroupArray = sortDateGroup(itemsGroupedByDateArray)
  const sortedTasksByDateArray = sortTasksByDate(sortedByDateGroupArray)
  return sortedTasksByDateArray
}

const sortDateGroup = (array) => {
  return array.sort((a,b) => {
    return new Date(a.dateGroup) - new Date(b.dateGroup)
  })
}

const sortTasksByDate = (array) => {
  var arrayCopy = [...array]

  arrayCopy.forEach((section) => {
    const { items } = section
    arrayCopy.items = items.sort((a,b) => {
      return new Date(a.date) - new Date(b.date) // earlier time first
    })
  })

  return arrayCopy
}

const prepareArrayForSectionList = (array) => {
  var resultArray = []

  array.forEach((section) => {
    const { dateGroup, items } = section
    const formattedTitle = formatDateForTitle(dateGroup)

    var dataArray = []
    items.forEach((taskItem) => {
      const { date, id, taskName, notes } = taskItem
      dataArray = [...dataArray, {id: id, taskName: taskName, notes: notes, date: date}]
    })

    resultArray = [...resultArray, {title: formattedTitle, data: dataArray}]
  })

  return resultArray
}

const formatDateForTitle = (date: string) => {
  const dateObject = new Date(date),
    month = moment(dateObject).format('MMMM')
  return dateObject.getDate() + " " + month
}

/////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

const testTaskNameAndDate = () => {
  const beforeState = {
    "id": "5srtvsvev",
    "taskName": "ませんか",
    "notes": "efefasdad",
    "dates": ["July 17, 2017 11:13:00"],
    "ratingHistory": [],
    "srs": {
      "easinessFactor": 2.5,
      "interval": 0,
      "repetition": 0
    }
  }

  const expectedState = {
    id: '5srtvsvev',
    taskName: 'ませんか',
    notes: 'efefasdad',
    date: new Date('July 17, 2017 11:13:00').toString()
  }

  expect(itemWithCalculatedDueDate(beforeState)).toEqual(expectedState)
}
// testTaskNameAndDate()

const testGroupItemsByDate = () => {
  const beforeState = [
    { "id": "5srtvsvev",
      "taskName": "ませんか",
      "notes": "",
      "date": "July 17, 2017 11:13:00",
    },
    { "id": "vtsrvtrtv",
      "taskName": "ましょう・ましょうか",
      "notes": "",
      "date": "July 17, 2017 11:13:00",
    },
    { "id": "jdb56srv5",
      "taskName": "てはいけません",
      "notes": "",
      "date": "July 16, 2017 10:13:00",
    },
    { "id": "S7SM6ND6BVD",
      "taskName": "何も",
      "notes": "",
      "date": "July 16, 2017 11:13:00",
    },
    { "id": "D6UD6MU",
      "taskName": "どこかに・どこにも",
      "notes": "",
      "date": "July 18, 2017 11:13:00",
    },
  ]

  const expectedState = [

  ]

  expect(groupItemsByDate(beforeState)).toEqual(expectedState)
}
// testGroupItemsByDate()

const testSortDateGroup = () => {
  const beforeState = [
    {dateGroup: 'Wed Jul 19 2017', items: []},
    {dateGroup: 'Sat Jul 29 2017', items: []},
    {dateGroup: 'Tue Jul 25 2017', items: []},
    {dateGroup: 'Thu Jul 20 2017', items: []}
  ]
  const expectedState = [
    {dateGroup: 'Wed Jul 19 2017', items: []},
    {dateGroup: 'Thu Jul 20 2017', items: []},
    {dateGroup: 'Tue Jul 25 2017', items: []},
    {dateGroup: 'Sat Jul 29 2017', items: []},
  ]
  expect(sortDateGroup(beforeState)).toEqual(expectedState)
}
// testSortDateGroup()

const testSortTasksByDate = () => {
  const beforeState = [
    {dateGroup: 'Wed Jul 19 2017', items: [
      {taskName: 'san', date: 'July 19, 2017 11:14:00'},
      {taskName: 'ni', date: 'July 19, 2017 22:23:00'},
      {taskName: 'ichi', date: 'July 19, 2017 08:34:00'},
      {taskName: 'yon', date: 'July 19, 2017 17:35:00'}
    ]},
    {dateGroup: 'Thu Jul 20 2017', items: [
      {taskName: 'go', date: 'July 20, 2017 17:13:00'},
      {taskName: 'roku', date: 'July 20, 2017 11:13:00'}
    ]}
  ]
  const expectedState = [
    {dateGroup: 'Wed Jul 19 2017', items: [
      {taskName: 'ichi', date: 'July 19, 2017 08:34:00'},
      {taskName: 'san', date: 'July 19, 2017 11:14:00'},
      {taskName: 'yon', date: 'July 19, 2017 17:35:00'},
      {taskName: 'ni', date: 'July 19, 2017 22:23:00'}
    ]},
    {dateGroup: 'Thu Jul 20 2017', items: [
      {taskName: 'roku', date: 'July 20, 2017 11:13:00'},
      {taskName: 'go', date: 'July 20, 2017 17:13:00'}
    ]}
  ]
  expect(sortTasksByDate(beforeState)).toEqual(expectedState)
}
// testSortTasksByDate()

const testFormatDateForTitle = () => {
  expect(formatDateForTitle('July 19, 2017 08:34:00')).toEqual('19 July')
  expect(formatDateForTitle('July 4, 2017')).toEqual('4 July')
}
// testFormatDateForTitle()

const testPrepareArrayForSectionList = () => {
  const beforeState = [
    {dateGroup: 'Wed Jul 19 2017', items: [
      {taskName: 'ichi', date: 'July 19, 2017 08:34:00'},
      {taskName: 'san', date: 'July 19, 2017 11:14:00'},
      {taskName: 'yon', date: 'July 19, 2017 17:35:00'},
      {taskName: 'ni', date: 'July 19, 2017 22:23:00'}
    ]},
    {dateGroup: 'Thu Jul 20 2017', items: [
      {taskName: 'roku', date: 'July 20, 2017 11:13:00'},
      {taskName: 'go', date: 'July 20, 2017 17:13:00'}
    ]}
  ]
  const expectedState = [
    {title: '19 July', data: [
      'ichi',
      'san',
      'yon',
      'ni',
    ]},
    {title: '20 July', data: [
      'roku',
      'go',
    ]}
  ]
  expect(prepareArrayForSectionList(beforeState)).toEqual(expectedState)
}
// testPrepareArrayForSectionList()

const testAddTaskNameToArrayMatchingDateWithEmptyArray = () => {
  const beforeState = []
  const item =  {
    id: 'ss4bcrsc',
    taskName: 'hello',
    notes: 'TiV7A!a]x',
    date: 'July 19, 2017 11:13:00'
  }
  const expectedState = [{
    dateGroup: 'Wed Jul 19 2017',
    items: [{
      id: 'ss4bcrsc',
      taskName: 'hello',
      notes: 'TiV7A!a]x',
      date: 'July 19, 2017 11:13:00'
    }]
  }]
  expect(addItemToArrayMatchingDate(beforeState, item)).toEqual(expectedState)
}
// testAddTaskNameToArrayMatchingDateWithEmptyArray()

const testAddTaskNameToArrayMatchingDateWithDifferentDate = () => {
  const beforeState = [{
    dateGroup: 'Wed Jul 19 2017',
    items: [{
      id: 'ss4bcrsc',
      taskName: 'hello',
      notes: 'TiV7A!a]x',
      date: 'July 19, 2017 11:13:00'
    }]
  }]
  const item = {
    id: 'Q$Kv&6lvzFp%tAh',
    taskName: 'Dv%^002T8',
    notes: 'uY3!2&HGLg6dJ]rq*[uE',
    date: 'July 25, 2017 11:13:00'
  }
  const expectedState = [{
    dateGroup: 'Wed Jul 19 2017',
    items: [{
      id: 'ss4bcrsc',
      taskName: 'hello',
      notes: 'TiV7A!a]x',
      date: 'July 19, 2017 11:13:00'
    }]
  },
  {
    dateGroup: 'Tue Jul 25 2017',
    items: [{
      id: 'Q$Kv&6lvzFp%tAh',
      taskName: 'Dv%^002T8',
      notes: 'uY3!2&HGLg6dJ]rq*[uE',
      date: 'July 25, 2017 11:13:00'
    }]
  }]
  expect(addItemToArrayMatchingDate(beforeState, item)).toEqual(expectedState)
}
// testAddTaskNameToArrayMatchingDateWithDifferentDate()

const testAddTaskNameToArrayMatchingDateWithSameDate = () => {
  const beforeState = [{dateGroup: 'Wed Jul 19 2017', items: [{taskName: 'hello', date: 'July 19, 2017 11:13:00'}]}]
  const afterState = addItemToArrayMatchingDate(beforeState, 'July 19, 2017 13:13:00', 'hola')
  const expectedState = [
    {dateGroup: 'Wed Jul 19 2017', items:
    [
      {taskName: 'hello', date: 'July 19, 2017 11:13:00'},
      {taskName: 'hola', date: 'July 19, 2017 13:13:00'}
    ]}]
  expect(afterState).toEqual(expectedState)
}
// testAddTaskNameToArrayMatchingDateWithSameDate()

const testAddTaskNameToArrayMatchingDateWithSameDateAtEndOfArray = () => {
  const beforeState = [
    {dateGroup: 'Wed Jul 19 2017', items: [
      {taskName: 'hello', date: 'July 19, 2017 11:13:00'}
    ]},
    {dateGroup: 'Fri Jul 20 2017', items: [
      {taskName: 'TGIF', date: 'July 20, 2017 11:13:00'}
    ]}
  ]
  const afterState = addItemToArrayMatchingDate(beforeState, 'July 20, 2017 13:13:00', 'Leeroy Jenkins')
  const expectedState = [
    {dateGroup: 'Wed Jul 19 2017', items: [
      {taskName: 'hello', date: 'July 19, 2017 11:13:00'}
    ]},
    {dateGroup: 'Fri Jul 20 2017', items: [
      {taskName: 'TGIF', date: 'July 20, 2017 11:13:00'},
      {taskName: 'Leeroy Jenkins', date: 'July 20, 2017 13:13:00'}
    ]}
  ]
  expect(afterState).toEqual(expectedState)
}
// testAddTaskNameToArrayMatchingDateWithSameDateAtEndOfArray()

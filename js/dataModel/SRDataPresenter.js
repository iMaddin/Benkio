// @flow
// expect causing error when running on device: Couldn't find preset "es2015"
// import expect, { createSpy, spyOn, isSpy } from 'expect'

export const processDataForList = (studyTasks) => {
  /**
   * 1. get only information needed for section list, in this case task name and the date
   * 2. Group tasks that belong to the same day
   * 3. sort day groups
   * 4. sort tasks inside day groups
   */
  const taskNameAndDateArray = studyTasks.map(taskNameAndDate);
  const tasksGroupedByDate = groupTasksByDate(taskNameAndDateArray);
  const sortedByDateArray = sortByDate(tasksGroupedByDate);
  const listReadyArray = prepareArrayForSectionList(sortedByDateArray);
  return listReadyArray
}

const taskNameAndDate = (singleTask) => {
    const { taskName, dates } = singleTask
    return {
      "taskName": taskName, "nextDate": dates[0]
    }
}

// TODO: rename to addTaskToArrayMatchingDate
// TODO: change parameter to task: {date: string, taskName: string}
const addTaskNameToArrayMatchingDate = (array: Array<object>, date: string, taskNameToAdd: string) => {
  var returnArray = [...array];
  const dateObject = new Date(date);
  var foundExistingDateGroup = false

  // search if resultArray already has object with that date
  array.forEach((item) => {
    const singleTask = item
    const { dateWithoutTime, tasksWithTimes } = singleTask;
    const dateWithoutTimeObject = new Date(dateWithoutTime);

    // compare dates, if dates match the day, then group
    if(dateWithoutTimeObject.toDateString() == dateObject.toDateString()) { // adds new tasks to existing date group
      singleTask['tasksWithTimes'] = [...tasksWithTimes, {taskName: taskNameToAdd, taskDate: date}];
      foundExistingDateGroup = true
      return
    }
  })

  if (returnArray.length == 0 || !foundExistingDateGroup) {
    returnArray = [...returnArray, {dateWithoutTime: dateObject.toDateString(), tasksWithTimes: [{taskName: taskNameToAdd, taskDate: date}]}];
  }

  return returnArray;
}

const groupTasksByDate = (taskWithDatesArray) => {
  var resultArray = [];

  taskWithDatesArray.forEach((item) => {
    const { taskName, nextDate } = item
    resultArray = addTaskNameToArrayMatchingDate(resultArray, nextDate, taskName);
  })

  return resultArray;
}

const sortByDate = (tasksGroupedByDateArray) => {
  const sortedByDateGroupArray = sortDateGroup(tasksGroupedByDateArray)
  const sortedTasksByDateArray = sortTasksByDate(sortedByDateGroupArray)
  return sortedTasksByDateArray
}

const sortDateGroup = (array: Array<{dateWithoutTime: string, tasksWithTimes: Array<{taskName: string, taskDate: string}>}>) => {
  return array.sort((a,b) => {
    return new Date(b.dateWithoutTime) - new Date(a.dateWithoutTime);
  })
}

const sortTasksByDate = (array: Array<{dateWithoutTime: string, tasksWithTimes: Array<{taskName: string, taskDate: string}>}>) => {
  var arrayCopy = [...array];

  arrayCopy.forEach((item) => {
    const { tasksWithTimes } = item
    arrayCopy['tasksWithTimes'] = tasksWithTimes.sort((a,b) => {
      return new Date(a.taskDate) - new Date(b.taskDate); // earlier time first
    })
  })

  return arrayCopy
}

//Array<{title: string, data: string}>
const prepareArrayForSectionList = (array: Array<{dateWithoutTime: string, tasksWithTimes: Array<{taskName: string, taskDate: string}>}>) => {

  var resultArray = []

  array.forEach((item) => {
    const { dateWithoutTime, tasksWithTimes } = item
    const formattedTitle = formatDateForTitle(dateWithoutTime)

    var dataArray = []
    tasksWithTimes.forEach((taskItem) => {
      const { taskName } = taskItem
      dataArray = [...dataArray, taskName]
    })

    resultArray = [...resultArray, {title: formattedTitle, data: dataArray}]
  })

  return resultArray
}

const formatDateForTitle = (date: string) => {
  const dateObject = new Date(date),
    locale = "en-us",
    month = dateObject.toLocaleString(locale, { month: "long" });
  return dateObject.getDate() + " " + month
}

/*
testSortDateGroup = () => {
  const beforeState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: []},
    {dateWithoutTime: 'Sat Jul 29 2017', tasksWithTimes: []},
    {dateWithoutTime: 'Tue Jul 25 2017', tasksWithTimes: []},
    {dateWithoutTime: 'Thu Jul 20 2017', tasksWithTimes: []}
  ]
  const expectedState = [
    {dateWithoutTime: 'Sat Jul 29 2017', tasksWithTimes: []},
    {dateWithoutTime: 'Tue Jul 25 2017', tasksWithTimes: []},
    {dateWithoutTime: 'Thu Jul 20 2017', tasksWithTimes: []},
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: []}
  ]
  expect(sortDateGroup(beforeState)).toEqual(expectedState)
}
testSortDateGroup()

testSortTasksByDate = () => {
  const beforeState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [
      {taskName: 'san', taskDate: 'July 19, 2017 11:14:00'},
      {taskName: 'ni', taskDate: 'July 19, 2017 22:23:00'},
      {taskName: 'ichi', taskDate: 'July 19, 2017 08:34:00'},
      {taskName: 'yon', taskDate: 'July 19, 2017 17:35:00'}
    ]},
    {dateWithoutTime: 'Thu Jul 20 2017', tasksWithTimes: [
      {taskName: 'go', taskDate: 'July 20, 2017 17:13:00'},
      {taskName: 'roku', taskDate: 'July 20, 2017 11:13:00'}
    ]}
  ]
  const expectedState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [
      {taskName: 'ichi', taskDate: 'July 19, 2017 08:34:00'},
      {taskName: 'san', taskDate: 'July 19, 2017 11:14:00'},
      {taskName: 'yon', taskDate: 'July 19, 2017 17:35:00'},
      {taskName: 'ni', taskDate: 'July 19, 2017 22:23:00'}
    ]},
    {dateWithoutTime: 'Thu Jul 20 2017', tasksWithTimes: [
      {taskName: 'roku', taskDate: 'July 20, 2017 11:13:00'},
      {taskName: 'go', taskDate: 'July 20, 2017 17:13:00'}
    ]}
  ]
  expect(sortTasksByDate(beforeState)).toEqual(expectedState)
}
testSortTasksByDate()

testFormatDateForTitle = () => {
  expect(formatDateForTitle('July 19, 2017 08:34:00')).toEqual('19 July')
  expect(formatDateForTitle('July 4, 2017')).toEqual('4 July')
}
testFormatDateForTitle()

testPrepareArrayForSectionList = () => {
  const beforeState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [
      {taskName: 'ichi', taskDate: 'July 19, 2017 08:34:00'},
      {taskName: 'san', taskDate: 'July 19, 2017 11:14:00'},
      {taskName: 'yon', taskDate: 'July 19, 2017 17:35:00'},
      {taskName: 'ni', taskDate: 'July 19, 2017 22:23:00'}
    ]},
    {dateWithoutTime: 'Thu Jul 20 2017', tasksWithTimes: [
      {taskName: 'roku', taskDate: 'July 20, 2017 11:13:00'},
      {taskName: 'go', taskDate: 'July 20, 2017 17:13:00'}
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
testPrepareArrayForSectionList()

testAddTaskNameToArrayMatchingDateWithEmptyArray = () => {
  const beforeState = []
  const afterState = addTaskNameToArrayMatchingDate(beforeState, 'July 19, 2017 11:13:00', 'hello')
  const expectedState = [{dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [{taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'}]}]
  expect(afterState).toEqual(expectedState)
}
testAddTaskNameToArrayMatchingDateWithDifferentDate = () => {
  const beforeState = [{dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [{taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'}]}]
  const afterState = addTaskNameToArrayMatchingDate(beforeState, 'July 20, 2017 11:13:00', 'bye')
  const expectedState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [{taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'}]},
    {dateWithoutTime: 'Thu Jul 20 2017', tasksWithTimes: [{taskName: 'bye', taskDate: 'July 20, 2017 11:13:00'}]}
  ]
  expect(afterState).toEqual(expectedState)
}
testAddTaskNameToArrayMatchingDateWithSameDate = () => {
  const beforeState = [{dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [{taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'}]}]
  const afterState = addTaskNameToArrayMatchingDate(beforeState, 'July 19, 2017 13:13:00', 'hola')
  const expectedState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes:
    [
      {taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'},
      {taskName: 'hola', taskDate: 'July 19, 2017 13:13:00'}
    ]}]
  expect(afterState).toEqual(expectedState)
}

testAddTaskNameToArrayMatchingDateWithSameDateAtEndOfArray = () => {
  const beforeState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [
      {taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'}
    ]},
    {dateWithoutTime: 'Fri Jul 20 2017', tasksWithTimes: [
      {taskName: 'TGIF', taskDate: 'July 20, 2017 11:13:00'}
    ]}
  ]
  const afterState = addTaskNameToArrayMatchingDate(beforeState, 'July 20, 2017 13:13:00', 'Leeroy Jenkins')
  const expectedState = [
    {dateWithoutTime: 'Wed Jul 19 2017', tasksWithTimes: [
      {taskName: 'hello', taskDate: 'July 19, 2017 11:13:00'}
    ]},
    {dateWithoutTime: 'Fri Jul 20 2017', tasksWithTimes: [
      {taskName: 'TGIF', taskDate: 'July 20, 2017 11:13:00'},
      {taskName: 'Leeroy Jenkins', taskDate: 'July 20, 2017 13:13:00'}
    ]}
  ]
  expect(afterState).toEqual(expectedState)
}

testAddTaskNameToArrayMatchingDateWithEmptyArray()
testAddTaskNameToArrayMatchingDateWithDifferentDate()
testAddTaskNameToArrayMatchingDateWithSameDate()
testAddTaskNameToArrayMatchingDateWithSameDateAtEndOfArray()
*/

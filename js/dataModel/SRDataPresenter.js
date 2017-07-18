// @flow
import expect, { createSpy, spyOn, isSpy } from 'expect'

export const processDataForList = (data: object) => {
  const { studyTasks } = data;

  // get task name, (possibly notes under task name) and date
  const taskNameAndDateArray = studyTasks.map(taskNameAndDate);
  // console.log(taskNameAndDateArray);
  // group tasks with same date
  const tasksGroupedByDate = groupTasksByDate(taskNameAndDateArray);
  // console.log(tasksGroupedByDate);
  // sort by date
  const sortedByDateArray = sortByDate(tasksGroupedByDate);
  // console.log(sortedByDateArray);
  return sortedByDateArray
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
  for (var i = 0; i < array.length; i++) {
    const singleTask = returnArray[i];
    const { dateWithoutTime, tasksWithTimes } = singleTask;
    const dateWithoutTimeObject = new Date(dateWithoutTime);

    // compare dates, if dates match the day, then group
    if(dateWithoutTimeObject.toDateString() == dateObject.toDateString()) { // adds new tasks to existing date group
      singleTask['tasksWithTimes'] = [...tasksWithTimes, {taskName: taskNameToAdd, taskDate: date}];
      foundExistingDateGroup = true
      break
    }
  }

  if (returnArray.length == 0 || !foundExistingDateGroup) {
    returnArray = [...returnArray, {dateWithoutTime: dateObject.toDateString(), tasksWithTimes: [{taskName: taskNameToAdd, taskDate: date}]}];
  }

  return returnArray;
}

const groupTasksByDate = (taskWithDatesArray: {taskName: string, nextDate: string}) => {
  var resultArray = [];

  for (var i=0; i < taskWithDatesArray.length; i++) {
    const { taskName, nextDate } = taskWithDatesArray[i]
    resultArray = addTaskNameToArrayMatchingDate(resultArray, nextDate, taskName);
  }

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

const sortTasksByDate = (array) => {
  for(var = i; i < array.length; i++) {
    
  }
}

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

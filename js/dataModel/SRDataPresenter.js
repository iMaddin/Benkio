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

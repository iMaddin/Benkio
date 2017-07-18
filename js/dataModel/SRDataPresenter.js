// @flow

export const processDataForList = (data: object) => {
  const { studyTasks } = data;

  // get task name, (possibly notes under task name) and date
  const taskNameAndDateArray = studyTasks.map(taskNameAndDate);

  // group tasks with same date
  const tasksGroupedByDate = groupTasksByDate(taskNameAndDateArray);

  // sort by date
  const sortedByDateArray = tasksGroupedByDate;
  console.log(sortedByDateArray);
  return sortedByDateArray
}

const taskNameAndDate = (singleTask) => {
    const { taskName, dates } = singleTask
    return {
      "taskName": taskName, "nextDate": dates[0]
    }
}

const addTaskNameToArrayMatchingDate = (array: Array<object>, date: string, taskNameToAdd: string) => {
  const copyArray = [...array];
  var returnArray = []

  // search if resultArray already has object with that date
  for (var i = 0; i < array.length; i++) {
    const singleTask = copyArray[i];
    const { nextDate, taskNames } = singleTask;

    if(nextDate == date) {
      singleTask['taskNames'] = [...taskNames, taskNameToAdd];
      returnArray = copyArray;
    } else {
      returnArray = [...array, {nextDate: date, taskNames: [taskNameToAdd]}];
    }
  }

  if (array.length == 0) {
    returnArray = [...array, {nextDate: date, taskNames: [taskNameToAdd]}];
  }

  return returnArray;
}

const groupTasksByDate = (taskWithDatesArray: {taskName: string, nextDate: string}) => {
  var resultArray = []; //{nextDate: string, taskNames: Array<string>}

  for (var i=0; i < taskWithDatesArray.length; i++) {
    const { taskName, nextDate } = taskWithDatesArray[i]
    resultArray = addTaskNameToArrayMatchingDate(resultArray, nextDate, taskName);
  }

  return resultArray;
}

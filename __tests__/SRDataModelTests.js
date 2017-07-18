// @flow
import { reducer } from '../js/dataModel/SRSimpleDataModel'
import { actionCreators } from '../js/dataModel/SRSimpleDataModel'
import mockData from '../js/dataModel/mockData.json'
import { processDataForList } from '../js/dataModel/SRDataPresenter'

test('Adding a task', () => {
  const stateBefore = {todos:[]};
  const action = actionCreators.add('Yahari');
  const stateAfter = {todos: ['Yahari']};
  expect(reducer(stateBefore, action)).toEqual(stateAfter);
});

test('Reading mockData.json', () => {
  const { studyTasks } = mockData;
  expect(Array.isArray(studyTasks)).toEqual(true);
});

test('Process data for display in SectionList', () => {

  const expectedResult = [
    { title: "November 10", data: ["といい"] },
    { title: "July 30", data: ["ておく","Volitional Form"] },
    { title: "July 23", data: ["˜し","たらどうですか"] },
    { title: "July 19", data: ["すぎる","でしょう"] },
    { title: "July 18", data: ["んです","どこかに・どこにも"] },
    { title: "July 17", data: ["ませんか","ましょう・ましょうか"] },
    { title: "July 16", data: ["てはいけません","何も"] },
    { title: "June 1", data: ["Passive Sentences"] }
  ];

  expect(processDataForList(mockData)).toEqual(expectedResult);
});

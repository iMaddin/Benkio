// @flow
import { reducer } from '../js/dataModel/SRSimpleDataModel'
import { actionCreators } from '../js/dataModel/SRSimpleDataModel'
import mockData from '../js/dataModel/mockData.json'
import { processDataForList } from '../js/dataModel/SRDataPresenter'

test('Adding a task', () => {
  const stateBefore = {todos:[]}
  const action = actionCreators.add('Yahari')
  const stateAfter = {todos: ['Yahari']}
  expect(reducer(stateBefore, action)).toEqual(stateAfter)
})

test('Reading mockData.json', () => {
  const { studyTasks } = mockData
  expect(Array.isArray(studyTasks)).toEqual(true)
})

test('Process data for display in SectionList', () => {

  const expectedResult = [
    { title: "10 November", data: ["といい"] },
    { title: "30 July", data: ["ておく","Volitional Form"] },
    { title: "23 July", data: ["˜し","たらどうですか"] },
    { title: "19 July", data: ["すぎる","でしょう"] },
    { title: "18 July", data: ["んです","どこかに・どこにも"] },
    { title: "17 July", data: ["ませんか","ましょう・ましょうか"] },
    { title: "16 July", data: ["てはいけません","何も"] },
    { title: "1 June", data: ["Passive Sentences"] }
  ]

  expect(processDataForList(mockData.studyTasks)).toEqual(expectedResult)
})

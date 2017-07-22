// @flow

import { processDataForList } from '../js/dataModel/SRDataPresenter'
import mockData from '../js/dataModel/mockData.json'

test('Process data for display in SectionList', () => {

  const expectedResult = [
    { title: "1 June", data: ["Passive Sentences"] },
    { title: "16 July", data: ["てはいけません","何も"] },
    { title: "17 July", data: ["ませんか","ましょう・ましょうか"] },
    { title: "18 July", data: ["んです","どこかに・どこにも"] },
    { title: "19 July", data: ["すぎる","でしょう"] },
    { title: "23 July", data: ["˜し","たらどうですか"] },
    { title: "30 July", data: ["Volitional Form"] },
    { title: "31 July", data: ["ておく"] },
    { title: "10 November", data: ["といい"] },
  ]

  expect(processDataForList(mockData.studyTasks)).toEqual(expectedResult)
})

test('Tasks falling into same date group', () => {

  const studyTasks = [
    { "id": "",
      "taskName": "たらどうですか",
      "notes": "",
      "dates": ["December 1, 2017 11:13:00"],
      "ratingHistory": [],
      "srs": {
        "easinessFactor": 2.5,
        "interval": 12,
        "repetition": 0
      },
      "intensity": ""},
    { "id": "",
      "taskName": "ておく",
      "notes": "",
      "dates": ["December 5, 2017 16:13:00"],
      "ratingHistory": [],
      "srs": {
        "easinessFactor": 2.5,
        "interval": 8,
        "repetition": 1
      },
      "intensity": ""},
    { "id": "",
      "taskName": "Volitional Form",
      "notes": "",
      "dates": ["July 30, 2017 11:13:00"],
      "ratingHistory": [],
      "srs": {
        "easinessFactor": 2.5,
        "interval": 0,
        "repetition": 0
      },
      "intensity": ""},
  ]

  const expected = [
    {title: '30 July', data: ['Volitional Form']},
    {title: '13 December', data: ['たらどうですか','ておく']}
  ]
  // [{title: string, data: string}]
  const sectionArray = processDataForList(studyTasks)

  expect(sectionArray.length).toEqual(2)
  expect(sectionArray[0]).toEqual({title: '30 July', data: ['Volitional Form']})
  expect(sectionArray[1]).toEqual({title: '13 December', data: ['たらどうですか','ておく']})

  // Seems like toContain can't compare objects this way
  // expect(sectionArray).toContain({title: '30 July', data: ['Volitional Form']})
  // expect(sectionArray).toContain({title: '13 December', data: ['たらどうですか','ておく']})
})

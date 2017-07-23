// @flow

import { processDataForList } from '../js/dataModel/SRDataPresenter'
import mockData from '../js/dataModel/mockData.json'

test('Process data for display in SectionList', () => {

  const expectedResult = [
    { title: "1 June", data: [
      { "id": "STYMS5S",
      "taskName": "Passive Sentences",
      "notes": "",
      }
    ]},
    { title: "16 July", data: [
      { "id": "jdb56srv5",
      "taskName": "てはいけません",
      "notes": "Jitzilca retlogih wa osutaf du duz losiwailu wo gov tiz eve timna.",
      },
      { "id": "S7SM6ND6BVD",
      "taskName": "何も",
      "notes": "As so ha zuf von bafnogam tev nunmonij tiskem ej liwujsav emaeve.",
      },
    ]},
    { title: "17 July", data: [
      { "id": "5srtvsvev",
      "taskName": "ませんか",
      "notes": "Diake anirakum nibu fojopkit woluvdi sa so zarum gi balig te atsot geulwen awmaci daz pe rarun.",
      },
      { "id": "vtsrvtrtv",
      "taskName": "ましょう・ましょうか",
      "notes": "Ciftiaj vegtew lazehe mewnevif veabbi uvedalrew zaf jondew erireh dovordol pej ne gatnorab cone.",
      },
    ]},
    { title: "18 July", data: [
      { "id": "SV5YS5NST",
      "taskName": "んです",
      "notes": "",
      },
      { "id": "D6UD6MU",
      "taskName": "どこかに・どこにも",
      "notes": "",
      },
    ]},
    { title: "19 July", data: [
      { "id": "5SM5YBV",
      "taskName": "すぎる",
      "notes": "",
      },
      { "id": "5SBS5MS55",
      "taskName": "でしょう",
      "notes": "",
      },
    ]},
    { title: "23 July", data: [
      { "id": "TSTBHHTBST",
      "taskName": "˜し",
      "notes": "",
      },
      { "id": "II,MOYUN",
      "taskName": "たらどうですか",
      "notes": "",
      },
    ]},
    { title: "30 July", data: [
      { "id": "RTBTMS",
      "taskName": "Volitional Form",
      "notes": "",
      },
    ]},
    { title: "31 July", data: [
      { "id": "ARBBTATB4B",
      "taskName": "ておく",
      "notes": "",
      },
    ]},
    { title: "10 November", data: [
      { "id": "STYNTYSS5M",
      "taskName": "といい",
      "notes": "",
      },
    ]},
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
    {title: '30 July', data: [
      {id:'', taskName: 'Volitional Form', notes:''}
    ]},
    {title: '13 December', data: [
      {id:'', taskName: 'たらどうですか', notes:''},
      {id:'', taskName: 'ておく', notes:''}
    ]}
  ]
  // [{title: string, data: string}]
  const sectionArray = processDataForList(studyTasks)

  expect(sectionArray.length).toEqual(2)
  expect(sectionArray[0]).toEqual(expected[0])
  expect(sectionArray[1]).toEqual(expected[1])

  // Seems like toContain can't compare objects this way
  // expect(sectionArray).toContain({title: '30 July', data: ['Volitional Form']})
  // expect(sectionArray).toContain({title: '13 December', data: ['たらどうですか','ておく']})
})

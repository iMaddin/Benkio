// @flow

import { processDataForList } from '../js/dataModel/SRDataPresenter'
import mockData from '../js/dataModel/mockData.json'

test('Process data for display in table view', () => {

  const expectedResult = [
    {
      "date": "Thu Jun 01 2017 11:13:00 GMT+0200 (CEST)",
      "id": "STYMS5S",
      "notes": "",
      "taskName": "Passive Sentences"
    },
    {
      "date": "Sun Jul 16 2017 10:13:00 GMT+0200 (CEST)",
      "id": "jdb56srv5",
      "notes": "Jitzilca retlogih wa osutaf du duz losiwailu wo gov tiz eve timna.",
      "taskName": "てはいけません"
    },
    {
      "date": "Sun Jul 16 2017 11:13:00 GMT+0200 (CEST)",
      "id": "S7SM6ND6BVD",
      "notes": "As so ha zuf von bafnogam tev nunmonij tiskem ej liwujsav emaeve.",
      "taskName": "何も"
    },
    {
      "date": "Mon Jul 17 2017 11:13:00 GMT+0200 (CEST)",
      "id": "5srtvsvev",
      "notes": "Diake anirakum nibu fojopkit woluvdi sa so zarum gi balig te atsot geulwen awmaci daz pe rarun.",
      "taskName": "ませんか"
    },
    {
      "date": "Mon Jul 17 2017 21:13:00 GMT+0200 (CEST)",
      "id": "vtsrvtrtv",
      "notes": "Ciftiaj vegtew lazehe mewnevif veabbi uvedalrew zaf jondew erireh dovordol pej ne gatnorab cone.",
      "taskName": "ましょう・ましょうか"
    },
    {
      "date": "Tue Jul 18 2017 06:13:00 GMT+0200 (CEST)",
      "id": "SV5YS5NST",
      "notes": "",
      "taskName": "んです"
    },
    {
      "date": "Tue Jul 18 2017 11:13:00 GMT+0200 (CEST)",
      "id": "D6UD6MU",
      "notes": "",
      "taskName": "どこかに・どこにも"
    },
    {
      "date": "Wed Jul 19 2017 11:13:00 GMT+0200 (CEST)",
      "id": "5SM5YBV",
      "notes": "",
      "taskName": "すぎる"
    },
    {
      "date": "Wed Jul 19 2017 13:13:00 GMT+0200 (CEST)",
      "id": "5SBS5MS55",
      "notes": "",
      "taskName": "でしょう"
    },
    {
      "date": "Sun Jul 23 2017 11:13:00 GMT+0200 (CEST)",
      "id": "TSTBHHTBST",
      "notes": "",
      "taskName": "˜し"
    },
    {
      "date": "Sun Jul 23 2017 21:13:00 GMT+0200 (CEST)",
      "id": "II,MOYUN",
      "notes": "",
      "taskName": "たらどうですか"
    },
    {
      "date": "Sun Jul 30 2017 11:13:00 GMT+0200 (CEST)",
      "id": "RTBTMS",
      "notes": "",
      "taskName": "Volitional Form"
    },
    {
      "date": "Mon Jul 31 2017 11:13:00 GMT+0200 (CEST)",
      "id": "ARBBTATB4B",
      "notes": "",
      "taskName": "ておく"
    },
    {
      "date": "Fri Nov 10 2017 11:13:00 GMT+0100 (CET)",
      "id": "STYNTYSS5M",
      "notes": "",
      "taskName": "といい"
    }
  ]

  expect(processDataForList(mockData.studyTasks)).toEqual(expectedResult)
})

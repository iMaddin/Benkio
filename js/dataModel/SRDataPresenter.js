// @flow

export const processDataForList = (data: object) => {
  // TODO: turn data into something that can be put into SectionList
  return [
    {title: 'D', data: data},
    {title: 'J', data: ['Jackson', 'James', 'Jillian', 'Jimmy', 'Joel', 'John', 'Julie']},
  ]
}

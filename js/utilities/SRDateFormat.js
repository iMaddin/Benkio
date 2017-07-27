// @flow
import moment from 'moment'

export function formatCellDate(date: string) {
  const itemIsOverDue = moment(date).isBefore(new Date(), 'day')

  var formattedDate = ''
  const momentDate = moment(date)

  formattedDate = momentDate.calendar(null, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: 'D MMM'
  });

  if (itemIsOverDue) {
    const momentFromNow = moment(date)
    momentFromNow.format('dd')
    formattedDate = momentFromNow.fromNow()
  }
  return formattedDate
}

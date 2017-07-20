// @flow
import { capitalizeFirstLetter } from '../js/utilities/String+Capitalize'

test('capitalizeFirstLetter()', () => {
  expect(capitalizeFirstLetter('ALLCAPITALIZED')).toEqual('Allcapitalized')
  expect(capitalizeFirstLetter('multiple words in this string')).toEqual('Multiple words in this string')
  expect(capitalizeFirstLetter('justalowercaseword')).toEqual('Justalowercaseword')
})

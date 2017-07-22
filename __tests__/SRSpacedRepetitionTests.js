// @flow
import { SRSpacedRepetition } from '../js/SRSpacedRepetition'

test('Test nextDate()', () => {
  const taylorSwift = 'December 13, 1989 12:34:56'
  const leapYear2016 = 'February 28, 2016 12:34:56'

  expect(
    new Date(new SRSpacedRepetition(2.5, 0, 0).nextDate(taylorSwift)).getTime()
  ).toEqual(
    new Date('December 13, 1989 12:34:56').getTime())

  expect(
    new Date(new SRSpacedRepetition(2.5, 1, 0).nextDate(taylorSwift)).getTime()
  ).toEqual(
    new Date('December 14, 1989 12:34:56').getTime())

  expect(
    new Date(new SRSpacedRepetition(2.5, 3, 0).nextDate(taylorSwift)).getTime()
  ).toEqual(
    new Date('December 16, 1989 12:34:56').getTime())

  expect(
    new Date(new SRSpacedRepetition(2.5, 6, 0).nextDate(taylorSwift)).getTime()
  ).toEqual(
    new Date('December 19, 1989 12:34:56').getTime())

  expect(
    new Date(new SRSpacedRepetition(2.5, 0, 0).nextDate(taylorSwift)).getTime()
  ).toEqual(
    new Date('December 13, 1989 12:34:56').getTime())

  // nextDate -> different month

  expect(
    new Date(new SRSpacedRepetition(2.5, 1, 0).nextDate(leapYear2016)).getTime()
  ).toEqual(
    new Date('February 29, 2016 12:34:56').getTime())

  expect(
    new Date(new SRSpacedRepetition(2.5, 2, 0).nextDate(leapYear2016)).getTime()
  ).toEqual(
    new Date('March 1, 2016 12:34:56').getTime())

})

const minEF = 1.3
const maxEF = 2.5

test('EF of Ok rating', () => {

  expect(
    new SRSpacedRepetition(1.3, 0, 0).ok().easinessFactor
  ).toBeCloseTo(minEF) // lower EF (but not below 1.3)

  expect(
    new SRSpacedRepetition(1.4, 0, 0).ok().easinessFactor
  ).toBeGreaterThanOrEqual(minEF)

  expect(
    new SRSpacedRepetition(1.4, 0, 0).ok().easinessFactor
  ).toBeLessThan(1.4)

})

test('EF of Good rating', () => {
  expect(
    new SRSpacedRepetition(1.3, 0, 0).good().easinessFactor
  ).toBeCloseTo(1.3)

  expect(
    new SRSpacedRepetition(1.9).good().easinessFactor
  ).toBeCloseTo(1.9)

  expect(
    new SRSpacedRepetition().good().easinessFactor
  ).toBeCloseTo(2.5)
})

test('EF of Perfect rating', () => {
  expect(
    new SRSpacedRepetition().perfect().easinessFactor
  ).toBeCloseTo(maxEF)

  expect(
    new SRSpacedRepetition(2.4, 0, 0).perfect().easinessFactor
  ).toBeLessThanOrEqual(maxEF)

  expect(
    new SRSpacedRepetition(2.4, 0, 0).perfect().easinessFactor
  ).toBeGreatherThan(2.4)
})

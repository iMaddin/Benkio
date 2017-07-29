// @flow
import SRSpacedRepetition from '../js/utilities/SRSpacedRepetition'

test('First Okay Rating', () => {
  const ef = 1.9
  const { easinessFactor, repetition, interval } = new SRSpacedRepetition(ef, 0, 0).ok()
  expect(easinessFactor).toBeLessThan(ef)
  expect(repetition).toBe(1)
  expect(interval).toBe(1)
})

test('Second Okay Rating', () => {
  const ef = 1.9
  const { easinessFactor, repetition, interval } = new SRSpacedRepetition(ef, 0, 0).ok().ok()
  expect(easinessFactor).toBeLessThan(new SRSpacedRepetition(ef, 0, 0).ok().easinessFactor)
  expect(repetition).toBe(2)
  expect(interval).toBe(6)
})

test('Third Okay Rating', () => {
  const ef = 1.9
  const { easinessFactor, repetition, interval } = new SRSpacedRepetition(ef, 0, 0).ok().ok().ok()
  expect(easinessFactor).toBeLessThan(new SRSpacedRepetition(ef, 0, 0).ok().ok().easinessFactor)
  expect(repetition).toBe(3)
  expect(interval).toBe(3)
})

test('First Bad Rating', () => {
  const ef = 1.9
  const { easinessFactor, repetition, interval } = new SRSpacedRepetition(ef, 0, 0).bad()
  expect(easinessFactor).toBeLessThan(ef)
  expect(repetition).toBe(0)
  expect(interval).toBe(1)
})

test('First Good Rating', () => {
  const ef = 1.9
  const { easinessFactor, repetition, interval } = new SRSpacedRepetition(ef, 0, 0).good()
  expect(easinessFactor).toBeGreaterThan(ef)
  expect(repetition).toBe(1)
  expect(interval).toBe(1)
})

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
  ).toBeGreaterThan(2.4)
})

test('Interval when repetition is <= 2', () => {
  expect(
    new SRSpacedRepetition().ok().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition().ok().ok().interval
  ).toBe(6)

  expect(
    new SRSpacedRepetition().good().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition().good().good().interval
  ).toBe(6)

  expect(
    new SRSpacedRepetition().perfect().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition().perfect().perfect().interval
  ).toBe(6)
})

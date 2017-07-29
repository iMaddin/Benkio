// @flow
import SRSpacedRepetition from '../js/utilities/SRSpacedRepetition'

test('EF of Bad rating', () => {
  expect(
    new SRSpacedRepetition().bad().easinessFactor
  ).toBeLessThan(2.5)

  expect(
    new SRSpacedRepetition(2.4, 0, 0).bad().easinessFactor
  ).toBeLessThan(2.4)

  expect(
    new SRSpacedRepetition(1.3, 0, 0).bad().easinessFactor
  ).toBeCloseTo(1.3)
})

test('Interval of Bad rating', () => {
  expect(
    new SRSpacedRepetition().bad().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition(2.5, -24, 0).bad().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition(2.5, 0, 0).bad().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition(2.5, 1, 0).bad().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition(2.5, 5, 0).bad().interval
  ).toBe(1)

  expect(
    new SRSpacedRepetition(2.5, 120, 0).bad().interval
  ).toBe(1)
})

test('Repetition of Bad rating', () => {
  expect(
    new SRSpacedRepetition().bad().repetition
  ).toBe(0)

  expect(
    new SRSpacedRepetition(2.5, 0, -1).bad().repetition
  ).toBe(0)

  expect(
    new SRSpacedRepetition(2.5, 0, 0).bad().repetition
  ).toBe(0)

  expect(
    new SRSpacedRepetition(2.5, 0, 1).bad().repetition
  ).toBe(0)

  expect(
    new SRSpacedRepetition(2.5, 0, 8).bad().repetition
  ).toBe(0)

  expect(
    new SRSpacedRepetition(2.5, 0, 123).bad().repetition
  ).toBe(0)
})

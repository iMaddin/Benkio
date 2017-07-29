// @flow
import SRSpacedRepetition from '../js/utilities/SRSpacedRepetition'

const minEF = 1.3
const maxEF = 2.5

test('EF of Good rating', () => {
  expect(
    new SRSpacedRepetition(1.3, 0, 0).good().easinessFactor
  ).toBeGreaterThan(1.3)

  expect(
    new SRSpacedRepetition(1.9).good().easinessFactor
  ).toBeGreaterThan(1.9)

  expect(
    new SRSpacedRepetition().good().easinessFactor
  ).toBeCloseTo(2.5)
})

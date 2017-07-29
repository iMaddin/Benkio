// @flow
import SRSpacedRepetition from '../js/utilities/SRSpacedRepetition'

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

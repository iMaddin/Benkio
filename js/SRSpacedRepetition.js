// @flow
import expect from 'expect'

export function SRSpacedRepetition(
  easinessFactor: number = 2.5,
  interval: number = 1, // repeat tomorrow by default
  repetition: number = 0
) {
  this.easinessFactor = easinessFactor
  this.interval = interval
  this.repetition = repetition
}

SRSpacedRepetition.prototype.nextDate = function(previousDate = new Date().toString()) {
  const previousDateObject = new Date(previousDate)
  const nextDate = new Date(previousDateObject.getTime())
  nextDate.setDate(previousDateObject.getDate() + this.interval)
  return nextDate.toString()
}

// SRS
// Good 5 - ⬆️ EF, ⬆️ repetition -> interval ⬆️⬆️
// Okay 3 - ⬇️ EF, ⬆️ repetition -> interval ⬆️
// Bad  1 - ⬇️ EF, 0 repetition, 1 interval

export const SRSGrade = {
  GOOD: 5,
  OK: 3,
  BAD: 1,
}

SRSpacedRepetition.prototype.grade = function(grade: number){
  return gradeSRS(this, grade)
}

SRSpacedRepetition.prototype.good = function() {
  return this.grade(SRSGrade.GOOD)
}

SRSpacedRepetition.prototype.ok = function() {
  return this.grade(SRSGrade.OK)
}

SRSpacedRepetition.prototype.bad = function() {
  return this.grade(SRSGrade.BAD)
}

const gradeSRS = (srs: SRSpacedRepetition, grade: typeof(SRSGrade)) => {
  const { easinessFactor, interval, repetition } = srs
  var newEasinessFactor = easinessFactor,
      newInterval = interval,
      newRepetition = repetition;

  switch(grade) {
    case SRSGrade.GOOD:
      newEasinessFactor = increaseEF(newEasinessFactor)
      break
    case SRSGrade.OK:
    case SRSGrade.BAD:
      newEasinessFactor = decreaseEF(newEasinessFactor)
      break
    default:
      expect().toExist('No valid grade')
  }

  if (grade == SRSGrade.BAD) {
    newRepetition = 0;
    newInterval = 1;
  } else {
    newRepetition = newRepetition + 1;

    switch (newRepetition) {
      case 1:
        newInterval = 1;
        break;
      case 2:
        newInterval = 6;
        break;
      default:
        newInterval = Math.round((newRepetition - 1) * newEasinessFactor);
        break;
    }
  }

  return new SRSpacedRepetition(newEasinessFactor, newInterval, newRepetition)
}

const increaseEF = (EF) => { return gradeEasinessFactor(EF, 5)}
const decreaseEF = (EF) => { return gradeEasinessFactor(EF, 3)}

const gradeEasinessFactor = (EF, grade) => {
  expect(grade).toBeGreaterThanOrEqualTo(3)
  expect(grade).toBeLessThanOrEqualTo(5)

  const minEF = 1.3
  const maxEF = 2.5
  const oldEF = EF

  var easinessFactor = 0
  var gradedEF = oldEF + (0.1 - (5-grade)*(0.08+(5-grade)*0.02))

  if (gradedEF < minEF) {
    easinessFactor = minEF;
  } else if (gradedEF > maxEF) {
    easinessFactor = maxEF
  } else {
    easinessFactor = gradedEF;
  }

  expect(easinessFactor).toBeGreaterThanOrEqualTo(minEF)
  expect(easinessFactor).toBeLessThanOrEqualTo(maxEF)
  return easinessFactor
}

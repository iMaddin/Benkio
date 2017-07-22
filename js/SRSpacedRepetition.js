// @flow

export function SRSpacedRepetition(
  easinessFactor: number = 2.5,
  interval: number = 0,
  repetition: number = 0
) {
  this.easinessFactor = easinessFactor
  this.interval = interval
  this.repetition = repetition
}

SRSpacedRepetition.prototype.nextDate = function(previousDate: Date = new Date()) {
  const nextDate = new Date(previousDate.getTime())
  nextDate.setDate(previousDate.getDate() + this.interval)
  return nextDate
}

export const SRSGrade = {
  PERFECT: 5,
  GOOD: 4,
  OK: 3,
}

SRSpacedRepetition.prototype.grade = function(grade: number){
  return gradeSRS(this, grade)
}

SRSpacedRepetition.prototype.ok = function() {
  return this.grade(SRSGrade.OK)
}

SRSpacedRepetition.prototype.good = function() {
  return this.grade(SRSGrade.GOOD)
}

SRSpacedRepetition.prototype.perfect = function() {
  return this.grade(SRSGrade.PERFECT)
}

// 5 -> increase EF
// 4 -> same EF
// 3 -> lower EF
// 0,1,2 -> set repetition & interval to 0
const gradeSRS = (srs: SRSpacedRepetition, grade: number) => {
  const { easinessFactor, interval, repetition } = srs
  var easinessFactorCopy = easinessFactor,
      intervalCopy = interval,
      repetitionCopy = repetition;

  const minEF = 1.3
  const maxEF = 2.5

  const oldEF = easinessFactorCopy
  var newEF = 0

  if (grade < 3) {
    repetitionCopy = 0;
    intervalCopy = 0;
  } else {

    newEF = oldEF + (0.1 - (5-grade)*(0.08+(5-grade)*0.02));
    if (newEF < minEF) { // 1.3 is the minimum EF
      easinessFactorCopy = minEF;
    } else {
      easinessFactorCopy = newEF;
    }

    repetitionCopy = repetitionCopy + 1;

    switch (repetitionCopy) {
      case 1:
        intervalCopy = 1;
        break;
      case 2:
        intervalCopy = 6;
        break;
      default:
        intervalCopy = Math.round((repetitionCopy - 1) * easinessFactorCopy);
        break;
    }
  }

  return SRSpacedRepetition(easinessFactorCopy, intervalCopy, repetitionCopy)
}

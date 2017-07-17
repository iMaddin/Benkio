// @flow
import { reducer } from '../js/dataModel/SRSimpleDataModel'
import { actionCreators } from '../js/dataModel/SRSimpleDataModel'

test('Adding a task', () => {
  const stateBefore = {todos:[]};
  const action = actionCreators.add('Yahari');
  const stateAfter = {todos: ['Yahari']};
  expect(reducer(stateBefore, action)).toEqual(stateAfter);
});

/* eslint-env jasmine, browser */
import UpdateState from '../../src/reducers/update_state';

import _ from 'lodash';

describe('UpdateState', function(){
  let update, updateState, state, new_state;
  beforeEach(function(){
    update = {
      url: 'api/call/new'
    };

    state = {items: ['some items'], url: 'api/call'};

    updateState = UpdateState(state);
    new_state = updateState(update);
  });

  it('should return a function', function(){
    expect(_.isFunction(updateState)).toBeTruthy();
  });

  it('should set defaults', function(){
    expect(new_state.items).toEqual(['some items']);
    expect(new_state.url).toEqual('api/call/new');
  });
});

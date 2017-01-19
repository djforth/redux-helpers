/* eslint-env jasmine, browser */
import SetDefaults from '../../src/reducers/set_defaults';
import _ from 'lodash';

describe('SetDefaults', function(){
  let defaults, set_defaults, state, new_state;
  beforeEach(function(){
    defaults = {
      isFetching: false
      , items: ['some items']
      , url: ''
    };

    state = {url: 'api/call'};

    set_defaults = SetDefaults(defaults);
    new_state = set_defaults(state);
  });

  it('should return a function', function(){
    expect(_.isFunction(set_defaults)).toBeTruthy();
  });

  it('should set defaults', function(){
    expect(new_state.isFetching).toBeFalsy();
    expect(new_state.items).toEqual(['some items']);
    expect(new_state.url).toEqual('api/call');
  });
});

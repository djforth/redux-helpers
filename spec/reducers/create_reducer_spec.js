/* eslint-env jasmine, browser */
import CreateReducer from '../../src/reducers/create_reducer';

import {reducers} from '@djforth/redux-jasmine-helper';
const rootReducer = reducers.rootReducer;
import _ from 'lodash';

import {
  spies as SpyManager
  , stubs as Stubs

} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(CreateReducer);

let creator = CreateReducer({
  FAIL: 'CREATE_FAIL'
  , SEND: 'CREATE_SEND'
  , SUCCESS: 'CREATE_SUCCESS'
  , URL: 'CREATE_URL'
});

let test_reducer = rootReducer(stubs, creator);

describe('CreateReducer', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  beforeEach(()=>{
    spyManager.add('update_state');
    stubs.return('updateState')('returnValue', spyManager.get('update_state'));
  });

  it('should return function', function(){
    expect(_.isFunction(creator)).toBeTruthy();
  });

  test_reducer('addCreateUrl'
    , {
      type: 'CREATE_URL'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state'), 'api/call']
  );

  test_reducer('sendCreate'
    , {
      type: 'CREATE_SEND'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state')]
  );

  test_reducer('successCreate'
    , {
      type: 'CREATE_SUCCESS'
      , item: 'data'
      , receivedAt: 1234
    }
    , ['new-state'
    , 'data'
    , 1234
    ]
    , 0, 'new-state'
  );

  test_reducer('failCreate'
    , {
      type: 'CREATE_FAIL'
      , errors: 'some errors'
      , receivedAt: 1234
    }
    , [()=>spyManager.get('update_state'), 'some errors', 1234]
  );
});

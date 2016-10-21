/* eslint-env jasmine, browser */
import UpdateReducer from '../../src/reducers/update_reducer';
import {reducers} from '@djforth/redux-jasmine-helper';
const rootReducer = reducers.rootReducer;
import _ from 'lodash';

import {
  spies as SpyManager
  , stubs as Stubs
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(UpdateReducer);

let updater = UpdateReducer({
  FAIL: 'UPDATE_FAIL'
  , SEND: 'UPDATE_SEND'
  , SUCCESS: 'UPDATE_SUCCESS'
  , URL: 'UPDATE_URL'
});

let test_reducer = rootReducer(stubs, updater);

describe('UpdateReducer', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  beforeEach(()=>{
    spyManager.add('update_state');
    stubs.return('updateState')('returnValue', spyManager.get('update_state'));
  });

  test_reducer('addUpdateUrl'
    , {
      type: 'UPDATE_URL'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state'), 'api/call']
  );

  test_reducer('sendUpdate'
    , {
      type: 'UPDATE_SEND'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state')]
  );

  test_reducer('successUpdate'
    , {
      type: 'UPDATE_SUCCESS'
      , item: 'some-item'
      , receivedAt: 1234
    }
    , ['new-state', 'some-item', 1234]
    , 0, 'new-state'
  );

  test_reducer('failUpdate'
    , {
      type: 'UPDATE_FAIL'
      , errors: 'some errors'
      , receivedAt: 1234
    }
    , [()=>spyManager.get('update_state'), 'some errors', 1234]
  );
});

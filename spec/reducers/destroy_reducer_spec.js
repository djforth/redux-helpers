/* eslint-env jasmine, browser */
import DestroyReducer from '../../src/reducers/destroy_reducer';

import {reducers} from '@djforth/redux-jasmine-helper';
const rootReducer = reducers.rootReducer;
import _ from 'lodash';

import {
  spies as SpyManager
  , stubs as Stubs

} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(DestroyReducer);

let destroyer = DestroyReducer({
  FAIL: 'DELETE_FAIL'
  , SEND: 'DELETE_SEND'
  , SUCCESS: 'DELETE_SUCCESS'
  , URL: 'DELETE_URL'
});

let test_reducer = rootReducer(stubs, destroyer);

describe('DestroyReducer', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  beforeEach(()=>{
    spyManager.add('update_state');
    stubs.return('updateState')('returnValue', spyManager.get('update_state'));
  });

  test_reducer('addDestroyUrl'
    , {
      type: 'DELETE_URL'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state'), 'api/call']
  );

  test_reducer('sendDestroy'
    , {
      type: 'DELETE_SEND'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state')]
  );

  test_reducer('successDestroy'
    , {
      type: 'DELETE_SUCCESS'
      , id: 1
      , receivedAt: 1234
    }
    , ['new-state', 1, 1234]
    , 0, 'new-state'
  );

  test_reducer('failDestroy'
    , {
      type: 'DELETE_FAIL'
      , errors: 'some errors'
      , receivedAt: 1234
    }
    , [()=>spyManager.get('update_state'), 'some errors', 1234]
  );
});

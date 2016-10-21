/* eslint-env jasmine, browser */
import FetchReducer from '../../src/reducers/fetch_reducer';
import {reducers} from '@djforth/redux-jasmine-helper';
const rootReducer = reducers.rootReducer;
import _ from 'lodash';

import {
  spies as SpyManager
  , stubs as Stubs

} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(FetchReducer);

let fetcher = FetchReducer({
  RECEIVE: 'RECEIVE'
  , REQUEST: 'REQUEST'
  , URL: 'FETCH_URL'
});

let test_reducer = rootReducer(stubs, fetcher);

describe('FetchReducer', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  beforeEach(()=>{
    spyManager.add('update_state');
    stubs.return('updateState')('returnValue', spyManager.get('update_state'));
  });

  test_reducer('requestData'
    , {type: 'REQUEST'}
    , [()=>spyManager.get('update_state')]
  );

  test_reducer('receiveData'
    , {
      type: 'RECEIVE'
      , data: ['some data']
      , receivedAt: 1
    }
    , [()=>spyManager.get('update_state'), ['some data'], 1]
  );

  test_reducer('addUrl'
    , {
      type: 'FETCH_URL'
      , url: 'api/call'
    }
    , [()=>spyManager.get('update_state'), 'api/call']
  );
});

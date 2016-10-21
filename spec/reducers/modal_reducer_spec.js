/* eslint-env jasmine, browser */
import ModalReducer from '../../src/reducers/modal_reducer';

import {reducers} from '@djforth/redux-jasmine-helper';
const rootReducer = reducers.rootReducer;

import {
  spies as SpyManager
  , stubs as Stubs

} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(ModalReducer);

let fetcher = ModalReducer({
  CLOSE: 'CLOSE'
  , OPEN: 'OPEN'
});

let test_reducer = rootReducer(stubs, fetcher);

describe('ModalReducer', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  beforeEach(()=>{
    spyManager.add('update_state');
    stubs.return('updateState')('returnValue', spyManager.get('update_state'));
  });

  test_reducer('closeModal'
    , {type: 'CLOSE'}
    , [()=>spyManager.get('update_state')]
  );

  test_reducer('openModal'
    , {
      type: 'OPEN'
      , id: 1
    }
    , [()=>spyManager.get('update_state'), 1]
  );
});

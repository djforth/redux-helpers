/*eslint-env jasmine, browser */

import GetData, {
  addUrl
  , receiveData
  , requestData
} from '../../src/reducers/get_data';

import Immutable from 'immutable';

import {
  check_calls as checkCalls
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(GetData);

const getMod     = require('@djforth/morse-jasmine-wp/get_module')(GetData);

describe('GetData', function() {
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  beforeEach(function() {
    spyManager.add('update_state');
    spyManager.addReturn('update_state')('returnValue', 'updated state');
  });

  describe('addUrl', function() {
    let new_state;
    beforeEach(function(){
      new_state = addUrl(spyManager.get('update_state'), 'api/call');
    });

    checkCalls(()=>{
      return spyManager.get('update_state')
    }, 'update_state', ()=>[{url: 'api/call'}]);

    it('should return updated state', function() {
      expect(new_state).toEqual('updated state');
    });
  });

  describe('receiveData', function() {
    let new_state;
    beforeEach(function(){
      new_state = receiveData(spyManager.get('update_state'), ['some data'], 1234);
    });

    checkCalls(()=>{
      return spyManager.get('update_state');
    }, 'update_state', ()=>[{
      isFetching: false
      , didInvalidate: false
      , items: Immutable.fromJS(['some data'])
      , lastUpdated: 1234
    }]);

    it('should return updated state', function() {
      expect(new_state).toEqual('updated state');
    });
  });

  describe('requestData', function() {
    let new_state;
    beforeEach(function(){
      new_state = requestData(spyManager.get('update_state'));
    });

    checkCalls(()=>{
      return spyManager.get('update_state');
    }, 'update_state', ()=>[{
      isFetching: true
      , didInvalidate: false
    }]);

    it('should return updated state', function() {
      expect(new_state).toEqual('updated state');
    });
  });
});

/* eslint-env jasmine, browser */
import DestroyData, {
  addDestroyUrl
  , failDestroy
  , sendDestroy
  , successDestroy
} from '../../src/reducers/destroy_data';

import Immutable from 'immutable';

import {
  check_multiple_calls as checkMulti
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs

} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(DestroyData);

const getMod     = require('@djforth/morse-jasmine-wp/get_module')(DestroyData);

// const checkCalls = require('@djforth/morse-jasmine-wp/check_calls')
//   , checkMulti = require('@djforth/morse-jasmine-wp/check_multiple_calls')
//   , getMod     = require('@djforth/morse-jasmine-wp/get_module')(DestroyData)
//   , spyManager = require('@djforth/morse-jasmine-wp/spy_manager')()
//   , stubs      = require('@djforth/morse-jasmine-wp/stub_inner')(DestroyData);

describe('destroying data', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addDestroyUrl', function(){
    let state;
    let destroy_url = 'destroy/something';
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      state = addDestroyUrl(spyManager.get('update_state'), destroy_url);
    });

    it('should return correct value', function(){
      expect(state).toEqual({destroy_url: destroy_url});
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{destroy_url: destroy_url}]
      ]
    };

    checkMulti(calls);
  });

  describe('failDestroy', function(){
    let state;
    let errors = 'some errors';
    let lastUpdated =  Date.now();
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      state = failDestroy(spyManager.get('update_state'), errors, lastUpdated);
    });

    it('should update state', function(){
      expect(state.isDestroying).toBeFalsy();
      expect(state.didError).toBeTruthy();
      expect(state.errors).toEqual(errors);
      expect(state.lastUpdated).toEqual(lastUpdated);
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{
        isDestroying: false
        , didError: true
        , errors: errors
        , lastUpdated: lastUpdated
      }]
      ]
    };

    checkMulti(calls);
  });

  describe('sendDestroy', function(){
    let new_state;
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      new_state = sendDestroy(spyManager.get('update_state'));
    });

    it('should update state', function(){
      expect(new_state.isDestroying).toBeTruthy();
      expect(new_state.didError).toBeFalsy();
      expect(new_state.errors).toBeNull();
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{
        isDestroying: true
          , didError: false
          , errors: null
      }]
      ]
    };

    checkMulti(calls);
  });

  describe('successDestroy', function(){
    let state, new_state, return_state;
    let lastUpdated =  Date.now();
    beforeEach(function(){
      state = {
        items: Immutable.fromJS([{title: 'title0'}, {title: 'title1'}])
      };

      return_state = {
        isDestroying: false
        , didError: false
        , errors: null
        , items: state.items.pop()
        , lastUpdated: lastUpdated
      };
      // spyManager.add('update_state');

      spyManager.addReturn('update_state')('callFake', (s)=>s);
      stubs.return('updateState')('returnValue', spyManager.get('update_state'));
      stubs.return('destroy_item')('callFake', (items)=>items.pop());
      new_state = successDestroy(state, 1, lastUpdated);
    });

    it('should update state', function(){
      expect(new_state.isDestroying).toBeFalsy();
      expect(new_state.didError).toBeFalsy();
      expect(new_state.errors).toBeNull();
      expect(new_state.items.equals(return_state.items)).toBeTruthy();
      expect(new_state.lastUpdated).toEqual(lastUpdated);
    });

    let calls = {
      updateState: [()=>{
        return stubs.get('updateState');
      }, ()=>[state]
      ]
      , update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[return_state]
      ]
    };

    checkMulti(calls);
  });

  describe('destroy_item', function(){
    let destroy_item, items;
    beforeEach(function(){
      destroy_item = getMod('destroy_item');
      items = Immutable.fromJS([
        {id: 0, title: 'title1'}
        , {id: 1, title: 'title2'}
      ]);
    });

    it('should return items if id not match', function(){
      let new_items = destroy_item(items, 2);
      expect(new_items.equals(items)).toBeTruthy();
    });

    it('should return items if id not match', function(){
      let new_items = destroy_item(items, 1);
      expect(new_items.equals(items)).toBeFalsy();
      expect(new_items.size).toEqual(1);
    });
  });
});

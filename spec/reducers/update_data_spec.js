/* eslint-env jasmine, browser */

import Updatedata, {
  addUpdateUrl
  , failUpdate
  , sendUpdate
  , successUpdate
} from '../../src/reducers/update_data';

// import {actions} from '@djforth/redux-jasmine-helper';
// const actionMethod = actions.actionMethod;

import _ from 'lodash';
import Immutable from 'immutable';

import {
  check_multiple_calls as checkMulti
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs

} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(Updatedata);

const getMod     = require('@djforth/morse-jasmine-wp/get_module')(Updatedata);

describe('Update Data Actions', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addUpdateUrl', function(){
    let state;
    let update_url = 'update/something';
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      state = addUpdateUrl(spyManager.get('update_state'), update_url);
    });

    it('should return correct value', function(){
      expect(state).toEqual({update_url: update_url});
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{update_url: update_url}]
      ]
    };

    checkMulti(calls);
  });

  describe('failUpdate', function(){
    let state;
    let errors = 'some errors';
    let lastUpdated =  Date.now();
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      state = failUpdate(spyManager.get('update_state'), errors, lastUpdated);
    });

    it('should update state', function(){
      expect(state.isUpdating).toBeFalsy();
      expect(state.didError).toBeTruthy();
      expect(state.errors).toEqual(errors);
      expect(state.lastUpdated).toEqual(lastUpdated);
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{
        isUpdating: false
        , didError: true
        , errors: errors
        , lastUpdated: lastUpdated
      }]
      ]
    };

    checkMulti(calls);
  });

  describe('sendUpdate', function(){
    let new_state;
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      new_state = sendUpdate(spyManager.get('update_state'));
    });

    it('should update state', function(){
      expect(new_state.isUpdating).toBeTruthy();
      expect(new_state.didError).toBeFalsy();
      expect(new_state.errors).toBeNull();
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{
        isUpdating: true
        , didError: false
        , errors: null
      }]
      ]
    };
    checkMulti(calls);
  });

  describe('successCreate', function(){
    let state, new_state, return_state, items;
    let data = {title: 'title1'};
    let lastUpdated =  Date.now();
    beforeEach(function(){
      state = {
        items: Immutable.fromJS([{title: 'title0'}])
      };
      let items = Immutable.fromJS([{title: 'title1'}]);
      return_state = {
        isUpdating: false
        , didError: false
        , errors: null
        , items: items
        , lastUpdated: lastUpdated
      };

      spyManager.addReturn('update_state')('callFake', (s)=>s);
      stubs.return('update_item')('returnValue', items);
      stubs.return('updateState')('returnValue', spyManager.get('update_state'));
      new_state = successUpdate(state, data, lastUpdated);
    });

    it('should update state', function(){
      expect(new_state.isUpdating).toBeFalsy();
      expect(new_state.didError).toBeFalsy();
      expect(new_state.errors).toBeNull();
      // expect(new_state.items.equals(items)).toBeTruthy();
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

  describe('update_item', function(){
    let update_item, items, data, updated;
    beforeEach(function(){
      update_item = getMod('update_item');
      items = Immutable.fromJS([
        {id: 0, title: 'title0'}
        , {id: 1,  title: 'title1'}
      ]);

      data = {
        id: 1
        , title: 'New title'
      };

    });

    it('should not update item if not in list', function(){
      updated = update_item(items, {
        id: 3
        , title: 'New title'
      });

      expect(updated.equals(items)).toBeTruthy();
    });

    it('should update items', function(){
      updated = update_item(items, data);
      expect(updated.equals(items)).toBeFalsy();
      let item = updated.get(1);
      expect(item.get('title')).toEqual('New title');
    });
  });
});

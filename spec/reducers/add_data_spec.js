/* eslint-env jasmine, browser */
import AddData, {
  addItem
  , updateItemId
} from '../../src/reducers/add_data';

import Immutable from 'immutable';
import _ from 'lodash/core';

import {
  check_multiple_calls as checkMulti
  // , make_calls as MakeCalls
  // , not_called as CreateNotCalled
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs

  // , helper as Helper
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(AddData);

const getMod     = require('@djforth/morse-jasmine-wp/get_module')(AddData);

describe('AddData', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('createItem', function(){
    let createItem, data;
    beforeEach(function(){
      createItem = getMod('createItem');
      data = createItem({title: 'foo'});
    });

    it('data should add id', function(){
      expect(data.get('id')).toMatch(/new/);
    });

    it('data should add creating', function(){
      expect(data.get('creating')).toBeTruthy();
    });

    it('data should include title', function(){
      expect(data.get('title')).toEqual('foo');
    });
  });

  describe('removeExistingInCreating', function(){
    let removeExistingInCreating, data, new_data;
    beforeEach(function(){
      removeExistingInCreating = getMod('removeExistingInCreating');

      data = Immutable.fromJS([{id: 1, title: 'title0'}, {title: 'title1', id: 'new-1', creating: true}]);

      new_data = removeExistingInCreating(data);
    });

    it('should removing all items in creating mode', function(){
      expect(new_data.equals(data)).toBeFalsy();
      expect(new_data.size).toEqual(1);
    });
  });

  describe('addItem', function(){
    let new_state, state, data;
    beforeEach(function(){
      data = Immutable.fromJS({title: 'title1'});
      state = {
        items: Immutable.fromJS([{title: 'title0'}])
      };
      new_state = {
        items: Immutable.fromJS([{title: 'title0'}, {title: 'title1'}])
      };

      spyManager.add('update_state');
      spyManager.addReturn('update_state')('returnValue', new_state);
      stubs.return('removeExistingInCreating')('callFake', (items)=>items);
      stubs.return('createItem')('returnValue', data);
      stubs.return('updateState')('returnValue', spyManager.get('update_state'));
      data = addItem(state, {title: 'title1'});
    });

    let calls = {
      updateState: [()=>{
        return stubs.get('updateState');
      }, ()=>[state]
      ]
      , removeExistingInCreating: [()=>{
        return stubs.get('removeExistingInCreating');
      }, ()=>[state.items]
      ]
      , createItem: [()=>{
        return stubs.get('createItem');
      }, ()=>[{title: 'title1'}]
      ]
      , update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[new_state]
      ]
    };

    checkMulti(calls);
  });

  describe('updateItemId', function(){
    let state, new_state;
    beforeEach(function(){
      state = {
        items: Immutable.fromJS([{id: 1, title: 'title0'}, {title: 'title1', id: 'new-1', creating: true}])
      };

      spyManager.add('update_state');
      spyManager.addReturn('update_state')('callFake', (state)=>state);
      stubs.return('updateState')('returnValue', spyManager.get('update_state'));

      new_state = updateItemId(state, 2);
    });

    let calls = {
      updateState: [()=>{
        return stubs.get('updateState');
      }, ()=>[state]
      ]
    };

    checkMulti(calls);

    it('should update id of item in creating', function(){
      let item = new_state.items.get(1);
      let old_item = state.items.get(1);
      expect(item.equals(old_item)).toBeFalsy();
      expect(item.get('id')).toEqual(2);
      expect(item.get('creating')).toBeFalsy();
    });
  });
});

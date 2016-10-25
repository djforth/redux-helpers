/*eslint-env jasmine, browser */

import CreateData, {
  addCreateUrl
  , failCreate
  , sendCreate
  , successCreate
} from '../../src/reducers/create_data';

import Immutable from 'immutable';

import {
  check_multiple_calls as checkMulti
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs

  // , helper as Helper
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(CreateData);

describe('creating data', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addCreateUrl', function(){
    let state;
    let create_url = 'create/something';
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      state = addCreateUrl(spyManager.get('update_state'), create_url);
    });

    it('should return correct value', function(){
      expect(state).toEqual({create_url: create_url});
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{create_url: create_url}]
      ]
    };

    checkMulti(calls);
  });

  describe('failCreate', function(){
    let state;
    let errors = 'some errors';
    let lastUpdated =  Date.now();
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      state = failCreate(spyManager.get('update_state'), errors, lastUpdated);
    });

    it('should update state', function(){
      expect(state.isCreating).toBeFalsy();
      expect(state.didError).toBeTruthy();
      expect(state.errors).toEqual(errors);
      expect(state.lastUpdated).toEqual(lastUpdated);
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{
        isCreating: false
        , didError: true
        , errors: errors
        , lastUpdated: lastUpdated
      }]
      ]
    };

    checkMulti(calls);
  });

  describe('successCreate', function(){
    let state, new_state, return_state;
    let data = {title: 'title1'};
    let lastUpdated =  Date.now();
    beforeEach(function(){
      state = {
        items: Immutable.fromJS([{title: 'title0'}])
      };

      return_state = {
        isCreating: false
        , didError: true
        , errors: null
        , items: state.items.push(Immutable.fromJS(data))
        , lastUpdated: lastUpdated
      };
      // spyManager.add('update_state');

      spyManager.addReturn('update_state')('callFake', (s)=>s);
      stubs.return('updateState')('returnValue', spyManager.get('update_state'));
      new_state = successCreate(state, data, lastUpdated);
    });

    it('should update state', function(){
      expect(new_state.isCreating).toBeFalsy();
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

  describe('sendCreate', function(){
    let new_state;
    beforeEach(function(){
      spyManager.addReturn('update_state')('callFake', (s)=>s);
      new_state = sendCreate(spyManager.get('update_state'));
    });

    it('should update state', function(){
      expect(new_state.isCreating).toBeTruthy();
      expect(new_state.didError).toBeFalsy();
      expect(new_state.errors).toBeNull();
    });

    let calls = {
      update_state: [()=>{
        return spyManager.get('update_state');
      }, ()=>[{
          isCreating: true
          , didError: false
          , errors: null
        }]
      ]
    };

    checkMulti(calls);
  });
});

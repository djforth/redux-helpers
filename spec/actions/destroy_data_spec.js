/*eslint-env jasmine, browser */

import Destroydata, {
  addDestroyUrl
  , DestroyAction
  , DestroyData
  , Fail
  , Send
  , Success
} from '../../src/actions//destroy_data';

import {actions} from '@djforth/redux-jasmine-helper';
import _ from 'lodash';
import {
  check_multiple_calls as checkMulti
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs
} from '@djforth/stubs-spy-manager';

const actionMethod = actions.actionMethod;
const spyManager = SpyManager();
const stubs = Stubs(Destroydata);

describe('Destroy Data Actions', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addDestroyUrl', function(){
    let urlAdd;
    beforeEach(function(){
      urlAdd = addDestroyUrl('ADD_URL');
    });

    it('should return a function', function() {
      expect(_.isFunction(urlAdd)).toBeTruthy();
    });

    actionMethod('addDestroyUrl', ()=>urlAdd)({
      type: 'ADD_URL'
      , url: 'api/call'
    }
    , ['api/call']);
  });

  describe('DestroyData', function(){
    let destroyData, destroy_data, resolve, reject, promise;

    beforeEach(function(){
      stubs.add('Destroy');

      promise = new Promise((res, rej)=>{
        resolve = res;
        reject  = rej;
      });

      spyManager.add(['destroy_data', 'dispatch', 'send', 'success', 'fail']);
      spyManager.addReturn('destroy_data')('returnValue', promise);
      stubs.return('Destroy')('returnValue', spyManager.get('destroy_data'));
      stubs.return('CreateAlert')('returnValue', 'an error');

      spyManager.addReturn('fail')('returnValue', 'fail');
      spyManager.addReturn('send')('returnValue', 'sending');
      spyManager.addReturn('success')('returnValue', 'success');
      destroyData = DestroyData(spyManager.get('send'), spyManager.get('success'), spyManager.get('fail'));
      destroy_data = destroyData('/api/call', 'some data', 1)(spyManager.get('dispatch'));
    });

    let calls = {
      Destroy: [()=>{
        return stubs.get('Destroy');
      }, ()=>['/api/call']
      ]
      , destroy_data: ()=>spyManager.get('destroy_data')
      , send: ()=>spyManager.get('send')
      , dispatch: [()=>{
        return spyManager.get('dispatch');
      }, ()=>['sending']
      ]
    };

    checkMulti(calls);

    // testTranslations('DestroyData'
    //   , stubs
    //   , spyManager)(
    //     [()=>[]]
    //     , [()=>['alerts']]
    //     , []
    //   );

    it('destroy_data should dispatch success data', function(done){
      let dispatch = spyManager.get('dispatch');
      expect(dispatch.calls.count()).toEqual(1);
      resolve('success');
      setTimeout(function(){
        expect(spyManager.get('success')).toHaveBeenCalledWith(1);
        // expect(spyManager.get('t')).toHaveBeenCalledWith('destroyed', {type: 'Item'});
        // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('info', 'destroyed');
        expect(dispatch.calls.count()).toEqual(2);
        let args = dispatch.calls.argsFor(1);
        expect(args).toContain('success');
        done();
      }, 100);
    });

    it('destroy_data should catch failure', function(done){
      let dispatch = spyManager.get('dispatch');
      expect(dispatch.calls.count()).toEqual(1);
      reject('fail');
      setTimeout(function(){
        // expect(spyManager.get('t')).toHaveBeenCalledWith('fail');
        // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('danger', 'fail');
        expect(dispatch.calls.count()).toEqual(2);
        done();
      }, 100);
    });
  });

  describe('fail', function(){
    let failFn;
    beforeEach(function(){
      failFn = Fail('ERROR');
    });

    it('should return a function', function(){
      expect(_.isFunction(failFn)).toBeTruthy();
    });

    actionMethod('fail', ()=>failFn)({
      type: 'ERROR'
      , errors: 'some error'
      , receivedAt: {
        check: 'isNumber'
        , boolean: true
      }
    }
    , ['some error']);
  });

  describe('send', function(){
    let sendFn;
    beforeEach(function(){
      sendFn = Send('SENDING');
    });

    it('should return a function', function(){
      expect(_.isFunction(sendFn)).toBeTruthy();
    });

    actionMethod('send', ()=>sendFn)({
      type: 'SENDING'
    }
    , []);
  });

  describe('Success', function(){
    let successFn;
    beforeEach(function(){
      successFn = Success('SUCCESS');
    });

    it('should return a function', function(){
      expect(_.isFunction(successFn)).toBeTruthy();
    });

    actionMethod('success', ()=>successFn)({
      type: 'SUCCESS'
      , id: 1
      , receivedAt: {
        check: 'isNumber'
        , boolean: true
      }
    }
    , [1]);
  });

  describe('DestroyAction', function() {
    let destroyer;
    beforeEach(function() {
      stubs.return('DestroyData')('returnValue', 'destroyer');
      stubs.return('Fail')('returnValue', 'failer');
      stubs.return('Send')('returnValue', 'sender');

      destroyer = DestroyAction('fail_type', 'send_type', 'processor');
    });

    it('should return function', function() {
      expect(destroyer).toEqual('destroyer');
    });

    let calls = {
      DestroyData: [()=>{
        return stubs.get('DestroyData');
      }, ()=>['sender', 'processor', 'failer']
      ]
      , Fail: [()=>{
        return stubs.get('Fail');
      }, ()=>['fail_type']
      ]
      , Send: [()=>{
        return stubs.get('Send');
      }, ()=>['send_type']
      ]
    };

    checkMulti(calls);
  });
});

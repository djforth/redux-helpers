/* eslint-env jasmine, browser */
import Createdata, {
  addCreateUrl
  , CreateAction
  , CreateData
  , Fail
  , Send
  , Success
} from '../../src/actions//create_data';

import {actions} from '@djforth/redux-jasmine-helper';
const actionMethod = actions.actionMethod;

import _ from 'lodash';

import {
  check_multiple_calls as checkMulti
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
  , stubs as Stubs
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();
const stubs = Stubs(Createdata);

describe('Create Data Actions', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addCreateUrl', function(){
    let urlAdd;
    beforeEach(function(){
      urlAdd = addCreateUrl('ADD_URL');
    });

    it('should return a function', function(){
      expect(_.isFunction(urlAdd)).toBeTruthy();
    });

    actionMethod('addCreateUrl', ()=>urlAdd)({
      type: 'ADD_URL'
      , url: 'api/call'
    }
    , ['api/call']);
  });

  describe('CreateData', function(){
    let createData, create_data, resolve, reject, promise;

    // StubTranslation(stubs, spyManager);

    beforeEach(function(){
      stubs.add('Create');

      promise = new Promise((res, rej)=>{
        resolve = res;
        reject  = rej;
      });

      spyManager.add(['create_data', 'dispatch', 'send', 'success', 'fail']);
      spyManager.addReturn('create_data')('returnValue', promise);
      stubs.return('Create')('returnValue', spyManager.get('create_data'));

      spyManager.addReturn('fail')('returnValue', 'fail');
      spyManager.addReturn('send')('returnValue', 'sending');
      spyManager.addReturn('success')('returnValue', 'success');
      stubs.return('CreateAlert')('returnValue', 'an error');
      createData = CreateData(spyManager.get('send'), spyManager.get('success'));
      create_data = createData('/api/call', 'some data')(spyManager.get('dispatch'));
    });

    let calls = {
      Create: [()=>{
        return stubs.get('Create');
      }, ()=>['/api/call']
      ]
      , create_data: [()=>spyManager.get('create_data')
        , ()=>['some data']
      ]
      , send: ()=>spyManager.get('send')
      , dispatch: [()=>{
        return spyManager.get('dispatch');
      }, ()=>['sending']
      ]
    };

    checkMulti(calls);

    // testTranslations('CreateData'
    //   , stubs
    //   , spyManager)(
    //     [()=>[]]
    //     , [()=>['alerts']]
    //     , []
    //   );

    it('create_data should dispatch success data', function(done){
      let dispatch = spyManager.get('dispatch');
      expect(dispatch.calls.count()).toEqual(1);
      resolve('success');
      setTimeout(function(){
        expect(spyManager.get('success')).toHaveBeenCalledWith('success');
        // expect(spyManager.get('t')).toHaveBeenCalledWith('created', {type: 'Item'});
        // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('info', 'created');
        expect(dispatch.calls.count()).toEqual(2);
        let args = dispatch.calls.argsFor(1);
        expect(args).toContain('success');
        done();
      }, 10);
    });

    it('create_data should catch failure', function(done){
      let dispatch = spyManager.get('dispatch');
      promise.catch(()=>{

      });

      expect(dispatch.calls.count()).toEqual(1);
      reject('fail');
      setTimeout(function(){
        // expect(spyManager.get('t')).toHaveBeenCalledWith('fail');
        // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('danger', 'fail');
        expect(dispatch.calls.count()).toEqual(1);
        done();
      }, 10);
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
      , item: 'new item'
      , receivedAt: {
        check: 'isNumber'
        , boolean: true
      }
    }
    , ['new item']);
  });

  describe('CreateAction', function(){
    let fetcher;
    beforeEach(function(){
      stubs.return('CreateData')('returnValue', 'fetcher');
      stubs.return('Fail')('returnValue', 'failer');
      stubs.return('Send')('returnValue', 'sender');

      fetcher = CreateAction('fail_type', 'send_type', 'processor');
    });

    let calls = {
      CreateData: [()=>{
        return stubs.get('CreateData');
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


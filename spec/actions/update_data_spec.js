/*eslint-env jasmine, browser */

import Updatedata, {
  addUpdateUrl
  , UpdateAction
  , UpdateData
  , Fail
  , Send
  , Success
} from '../../src/actions//update_data';

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
const stubs = Stubs(Updatedata);

describe('Update Data Actions', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addUpdateUrl', function(){
    let urlAdd;
    beforeEach(function(){
      urlAdd = addUpdateUrl('ADD_URL');
    });

    it('should return a function', function(){
      expect(_.isFunction(urlAdd)).toBeTruthy();
    });

    actionMethod('addUpdateUrl', ()=>urlAdd)({
      type: 'ADD_URL'
      , url: 'api/call'
    }
    , ['api/call']);
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
      , didError: true
      , isUpdating: false
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
      , didError: false
      , isUpdating: true
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
      , isUpdating: false
      , receivedAt: {
        check: 'isNumber'
        , boolean: true
      }
    }
    , ['new item']);
  });

  describe('UpdateData', function(){
    let updateData, update_data, resolve, reject, promise;
    // StubTranslation(stubs, spyManager);
    beforeEach(function(){
      stubs.add('Patch');

      promise = new Promise((res, rej)=>{
        resolve = res;
        reject  = rej;
      });

      spyManager.add(['update_data', 'dispatch', 'send', 'success', 'fail']);
      spyManager.addReturn('update_data')('returnValue', promise);
      stubs.return('Patch')('returnValue', spyManager.get('update_data'));
      stubs.return('CreateAlert')('returnValue', 'an error');
      spyManager.addReturn('fail')('returnValue', 'fail');
      spyManager.addReturn('send')('returnValue', 'sending');
      spyManager.addReturn('success')('returnValue', 'success');

      updateData = UpdateData(spyManager.get('send'), spyManager.get('success'), spyManager.get('fail'));
      update_data = updateData('/api/call', 'some data', 1)(spyManager.get('dispatch'));
    });

    let calls = {
      Patch: [()=>{
        return stubs.get('Patch');
      }, ()=>['/api/call']
      ]
      , update_data: [()=>spyManager.get('update_data')
        , ()=>['some data', 1]
      ]
      , send: ()=>spyManager.get('send')
      , dispatch: [()=>{
        return spyManager.get('dispatch');
      }, ()=>['sending']
      ]
    };

    checkMulti(calls);

    // testTranslations('TitleCreate'
    //   , stubs
    //   , spyManager)(
    //     [()=>[]]
    //     , [()=>['alerts']]
    //     , []
    //   );

    it('update_data should dispatch success data', function(done){
      let dispatch = spyManager.get('dispatch');
      expect(dispatch.calls.count()).toEqual(1);
      resolve('success');
      setTimeout(function(){
        expect(spyManager.get('success')).toHaveBeenCalledWith('success');

        expect(dispatch.calls.count()).toEqual(2);
        let args = dispatch.calls.argsFor(1);
        expect(args).toContain('success');
        done();
      }, 100);
    });

    it('update_data should dispatch fail', function(done){
      let dispatch = spyManager.get('dispatch');
      expect(dispatch.calls.count()).toEqual(1);
      reject('fail', 404);
      setTimeout(function(){
        expect(spyManager.get('fail')).toHaveBeenCalled();
        // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('danger', 'fail');
        // expect(spyManager.get('t')).toHaveBeenCalledWith('fail');
        expect(dispatch.calls.count()).toEqual(2);
        let args = dispatch.calls.argsFor(1);
        expect(args).toContain('fail');
        done();
      }, 100);
    });
  });
});

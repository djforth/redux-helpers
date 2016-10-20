/* eslint-env jasmine, browser */

import Fetchdata, {
  addUrl
  , FetchAction
  , FetchData
  , Get
  , Receive
  , Request
} from '../src/fetch_data';

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
const stubs = Stubs(Fetchdata);

describe('Fetch Actions', function(){
  afterEach(()=>{
    spyManager.removeAll();
    stubs.revertAll(); // Reverts All stubs
  });

  describe('addurl', function(){
    let urlAdd;
    beforeEach(function(){
      urlAdd = addUrl('ADD_URL');
    });

    it('should return a function', function() {
      expect(_.isFunction(urlAdd)).toBeTruthy();
    });

    actionMethod('urlAdd', ()=>urlAdd)({
      type: 'ADD_URL'
      , url: 'api/call'
    }
    , ['api/call']);
  });

  describe('request', function(){
    let requester;
    beforeEach(function(){
      requester = Request('REQUEST');
    });

    it('should return a function', function() {
      expect(_.isFunction(requester)).toBeTruthy();
    });

    actionMethod('requester', ()=>requester)({type: 'REQUEST'});
  });

  describe('receive', function(){
    let receiver;
    beforeEach(function(){
      receiver = Receive('RECEIVE');
    });

    it('should return a function', function() {
      expect(_.isFunction(receiver)).toBeTruthy();
    });

    actionMethod('receiver', ()=>receiver)({
      type: 'RECEIVE'
      , data: 'Some Data'
      , receivedAt: {
        check: 'isNumber'
        , boolean: true
      }
    }, ['Some Data']);
  });

  describe('FetchData', function(){
    let fetchData, get_data, resolve, reject, promise;
    beforeEach(function(){
      stubs.add('Fetch');

      promise = new Promise((res, rej)=>{
        resolve = res;
        reject  = rej;
      });

      spyManager.add(['get_data', 'dispatch', 'receive', 'request']);
      spyManager.addReturn('get_data')('returnValue', promise);
      stubs.return('Fetch')('returnValue', spyManager.get('get_data'));
      stubs.return('CreateAlert')('callFake', (t)=>{
        if (t === 'danger') return 'an error';
        return 'fetched';
      });
      spyManager.add('addDispatcher');
      stubs.return('additionalDispatcher')('callFake', (add)=>{
        if (add) return spyManager.get('addDispatcher');
        return null;
      });

      spyManager.addReturn('request')('returnValue', 'requesting');
      spyManager.addReturn('receive')('returnValue', 'received');

      // fetchData = FetchData(spyManager.get('request'), spyManager.get('receive'));
      // get_data = fetchData('/api/call')(spyManager.get('dispatch'));
    });

    describe('when no additional', function() {
      beforeEach(()=>{
        fetchData = FetchData(spyManager.get('request'), spyManager.get('receive'));
        get_data = fetchData('/api/call')(spyManager.get('dispatch'));
      });

      let calls = {
        additionalDispatcher: [()=>{
          return stubs.get('additionalDispatcher');
        }, ()=>[undefined]
        ]
        , Fetch: [()=>{
          return stubs.get('Fetch');
        }, ()=>['/api/call']
        ]
        , get_data: ()=>spyManager.get('get_data')
        , request: ()=>spyManager.get('request')
        , dispatch: [()=>{
          return spyManager.get('dispatch');
        }, ()=>['requesting']
        ]
      };

      checkMulti(calls);

      // testTranslations('FetchData'
      // , stubs
      // , spyManager)(
      //   [()=>[]]
      //   , [()=>['alerts']]
      //   , []
      // );

      it('get_data should dispatch received data', function(done){
        let dispatch = spyManager.get('dispatch');
        expect(dispatch.calls.count()).toEqual(1);

        resolve('success');
        setTimeout(function(){
          expect(spyManager.get('receive')).toHaveBeenCalledWith('success');
          // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('info', 'loaded');
          // expect(spyManager.get('t')).toHaveBeenCalledWith('loaded');
          expect(dispatch.calls.count()).toEqual(2);
          let args = dispatch.calls.argsFor(1);
          expect(args).toContain('received');
          done();
        }, 100);
      });

      it('get_data should catch failure', function(done){
        let dispatch = spyManager.get('dispatch');
        expect(dispatch.calls.count()).toEqual(1);
        reject('fail');
        setTimeout(function(){
          // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('danger', 'fail');
          // expect(spyManager.get('t')).toHaveBeenCalledWith('fail');

          expect(dispatch.calls.count()).toEqual(1);
          done();
        }, 100);
      });
    });

    describe('when no additional', function() {
      beforeEach(()=>{

        fetchData = FetchData(spyManager.get('request'), spyManager.get('receive'), ['additional']);
        get_data = fetchData('/api/call')(spyManager.get('dispatch'));
      });

      let calls = {
        additionalDispatcher: [()=>{
          return stubs.get('additionalDispatcher');
        }, ()=>[['additional']]
        ]
        , Fetch: [()=>{
          return stubs.get('Fetch');
        }, ()=>['/api/call']
        ]
        , get_data: ()=>spyManager.get('get_data')
        , request: ()=>spyManager.get('request')
        , dispatch: [()=>{
          return spyManager.get('dispatch');
        }, ()=>['requesting']
        ]
      };

      checkMulti(calls);

      it('get_data should dispatch received data', function(done){
        let dispatch = spyManager.get('dispatch');
        expect(dispatch.calls.count()).toEqual(1);

        resolve('success');
        setTimeout(function(){
          expect(spyManager.get('receive')).toHaveBeenCalledWith('success');
          // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('info', 'loaded');
          // expect(spyManager.get('t')).toHaveBeenCalledWith('loaded');
          expect(dispatch.calls.count()).toEqual(2);
          let args = dispatch.calls.argsFor(1);
          expect(args).toContain('received');

          expect(spyManager.get('addDispatcher')).toHaveBeenCalledWith(dispatch, 'success');
          done();
        }, 100);
      });

      it('get_data should catch failure', function(done){
        let dispatch = spyManager.get('dispatch');
        expect(dispatch.calls.count()).toEqual(1);
        reject('fail');
        setTimeout(function(){
          // expect(stubs.get('CreateAlert')).toHaveBeenCalledWith('danger', 'fail');
          // expect(spyManager.get('t')).toHaveBeenCalledWith('fail');
          expect(dispatch.calls.count()).toEqual(1);
          done();
        }, 100);
      });
    });
  });

  describe('FetchAction', function() {
    let fetcher;
    beforeEach(function() {
      stubs.return('FetchData')('returnValue', 'fetcher');
      stubs.return('Receive')('returnValue', 'receiver');
      stubs.return('Request')('returnValue', 'requester');

      fetcher = FetchAction('receive_type', 'request_type');
    });

    it('should return the correct fetcher', function() {
      expect(fetcher).toEqual('fetcher');
    });

    let calls = {
      FetchData: [()=>{
        return stubs.get('FetchData');
      }, ()=>['requester', 'receiver']
      ]
      , Receive: [()=>{
        return stubs.get('Receive');
      }, ()=>['receive_type']
      ]
      , Request: [()=>{
        return stubs.get('Request');
      }, ()=>['request_type']
      ]
    };

    checkMulti(calls);
  });

  describe('Get', function(){
    let GetMethod;
    beforeEach(function(){
      spyManager.add([
        'fetcher'
        , 'getState'
        , 'dispatch'
      ]);

      stubs.return('FetchAction')('returnValue', spyManager.get('fetcher'));
      spyManager.addReturn('urlFn')('returnValue', 'some/api/call');

      spyManager.addReturn('getState')('returnValue', 'some state');
      spyManager.addReturn('fetcher')('returnValue', 'fetching');
      GetMethod = Get(spyManager.get('urlFn'), 'RECEIVE', 'REQUEST');
      GetMethod()(spyManager.get('dispatch'), spyManager.get('getState'));
    });

    it('should return a function', function(){
      expect(_.isFunction(GetMethod)).toBeTruthy();
    });

    let calls = {
      getState: ()=>spyManager.get('getState')
      , dispatch: [()=>{
        return spyManager.get('dispatch');
      }, ()=>['fetching']
      ]
      , FetchAction: [()=>stubs.get('FetchAction')
        , ()=>['RECEIVE', 'REQUEST']
      ]
      , fetcher: [()=>{
        return spyManager.get('fetcher');
      }, ()=>['some/api/call']
      ]
      , urlFn: [()=>{
        return spyManager.get('urlFn');
      }, ()=>['some state']
      ]
    };

    checkMulti(calls);
  });
});

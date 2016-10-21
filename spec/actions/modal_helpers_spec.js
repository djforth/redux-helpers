import ModalHelper, {
  Close, Edit, Open
} from '../../src/actions//modal_helpers';

import {actions} from '@djforth/redux-jasmine-helper';
const actionMethod = actions.actionMethod;

import _ from 'lodash';

import {
  check_multiple_calls as checkMulti
} from '@djforth/jasmine-call-helpers';

import {
  spies as SpyManager
} from '@djforth/stubs-spy-manager';

const spyManager = SpyManager();


describe('Modal helper', function() {
  describe('Open', function(){
    let opener;
    beforeEach(function(){
      opener = Open('OPEN');
    });

    it('should return a function', function() {
      expect(_.isFunction(opener)).toBeTruthy();
    });

    actionMethod('open', ()=>opener)({
      type: 'OPEN'
      , id: 1
    }
    , [1]);
  });

  describe('Close', function() {
    let closer;
    beforeEach(function(){
      closer = Close('CLOSE');
    });

    it('should return a function', function(){
      expect(_.isFunction(closer)).toBeTruthy();
    });

    actionMethod('Close', ()=>closer)({
      type: 'CLOSE'
    }
    , []);
  });

  describe('Edit ', function() {
    let edit, editor;
    beforeEach(function(){
      spyManager.addReturn('Opener')('returnValue', 'opener');
      spyManager.add('dispatch');
      edit = Edit(spyManager.get('Opener'));
      editor = edit(1);
      editor(spyManager.get('dispatch'));
    });

    it('should return a function', function(){
      expect(_.isFunction(edit)).toBeTruthy();
      expect(_.isFunction(editor)).toBeTruthy();
    });

    let calls = {
      Opener:[()=>spyManager.get('Opener')
      , ()=>[1]
      ]
      , dispatch: [()=>spyManager.get('dispatch')
      , ()=>['opener']
      ]
    }

    checkMulti(calls);
  });
});

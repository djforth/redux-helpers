/* eslint-env jasmine, browser */

import {
  Create
  , Update
} from '../src/association_helper';

import _ from 'lodash';

import {actions} from '@djforth/redux-jasmine-helper';
const actionMethod = actions.actionMethod;

describe('Association Helpers Actions', function(){
  describe('Create', function(){
    let create;
    beforeEach(function(){
      create = Create('CREATE');
    });

    it('should return a function', function(){
      expect(_.isFunction(create)).toBeTruthy();
    });

    actionMethod('Create', ()=>create)({
      type: 'CREATE'
      , data: 'some-data'
    }
    , ['some-data']);
  });

  describe('Update', function(){
    let update;
    beforeEach(function(){
      update = Update('UPDATE');
    });

    it('should return a function', function(){
      expect(_.isFunction(update)).toBeTruthy();
    });

    actionMethod('Update', ()=>update)({
      type: 'UPDATE'
      , id: 1
    }
    , [1]);
  });
});

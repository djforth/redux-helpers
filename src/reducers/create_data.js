import Immutable from 'immutable';
import updateState from './update_state';
import _ from 'lodash/core';

export const addCreateUrl = (update_state, create_url)=>{
  return update_state({create_url});
};

export const failCreate = (update_state, errors, receivedAt)=>{
  return update_state({
    isCreating: false
    , didError: true
    , errors: errors
    , lastUpdated: receivedAt
  });
};

export const successCreate = (state, item, receivedAt, flush)=>{
  let update_state = updateState(state);
  let {items} = state;
  if (flush){
    items = Immutable.fromJS(item);
  } else if (_.isArray(item)){
    items = items.concat(Immutable.fromJS(item));
  } else {
    items = items.push(Immutable.fromJS(item));
  }
  return update_state({
    isCreating: false
    , didError: false
    , errors: null
    , items
    , lastUpdated: receivedAt
  });
};

export const sendCreate = (update_state)=>{
  return update_state({
    isCreating: true
    , didError: false
    , errors: null
  });
};

// For Testing
export default ()=>'Create Data';

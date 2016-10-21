import Immutable from 'immutable';
// import _ from 'lodash/core';

export const addUrl = (update_state, url)=>{
  return update_state({url});
};

export const receiveData = (update_state, items, receivedAt)=>{
  return update_state({
    isFetching: false
    , didInvalidate: false
    , items: Immutable.fromJS(items)
    , lastUpdated: receivedAt
  });
};

export const requestData = (update_state)=>{
  return update_state({
    isFetching: true
    , didInvalidate: false
  });
};

// For Testing
export default ()=>'get Data';

import updateState from './update_state';

import {
  addUrl
  , receiveData
  , requestData
} from './get_data';

export default (types)=>{
  let {RECEIVE, REQUEST, URL} = types;
  return (state, action)=>{
    let update_state = updateState(state);
    switch (action.type){
      case REQUEST:
        return requestData(update_state);
      case RECEIVE:
        return receiveData(
          update_state
          , action.data
          , action.receivedAt
        );
      case URL:
        return addUrl(update_state, action.url);
      default:
        return false;
    }
  };
};

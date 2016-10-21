import updateState from './update_state';

import {
  addUpdateUrl
  , failUpdate
  , sendUpdate
  , successUpdate
} from './update_data';

export default (types)=>{
  let {FAIL, SEND, SUCCESS, URL} = types;
  return (state, action)=>{
    let update_state = updateState(state);
    switch (action.type){
      case URL:
        return addUpdateUrl(update_state, action.url);
      case SEND:
        return sendUpdate(update_state);
      case SUCCESS:
        return successUpdate(
          state
          , action.item
          , action.receivedAt
        );
      case FAIL:
        return failUpdate(
          update_state
          , action.errors
          , action.receivedAt
        );
      default:
        return false;
    }
  };
};

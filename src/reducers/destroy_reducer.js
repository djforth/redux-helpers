import updateState from './update_state';

import {
  addDestroyUrl
  , failDestroy
  , sendDestroy
  , successDestroy
} from './destroy_data';

export default (types)=>{
  let {FAIL, SEND, SUCCESS, URL} = types;
  return (state, action)=>{
    let update_state = updateState(state);
    switch (action.type){
      case URL:
        return addDestroyUrl(update_state, action.url);
      case SEND:
        return sendDestroy(update_state);
      case SUCCESS:
        return successDestroy(
          state
          , action.id
          , action.receivedAt
        );
      case FAIL:
        return failDestroy(
          update_state
          , action.errors
          , action.receivedAt
        );
      default:
        return false;
    }
  };
};

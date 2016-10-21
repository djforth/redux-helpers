import updateState from './update_state';

import {
  addCreateUrl
  , failCreate
  , sendCreate
  , successCreate
} from './create_data';

export default (types)=>{
  let {FAIL, SEND, SUCCESS, URL} = types;
  return (state, action)=>{
    let update_state = updateState(state);
    switch (action.type){
      case URL:
        return addCreateUrl(update_state, action.url);
      case SEND:
        return sendCreate(update_state);
      case SUCCESS:
        return successCreate(
          state
          , action.item
          , action.receivedAt
        );
      case FAIL:
        return failCreate(
          update_state
          , action.errors
          , action.receivedAt
        );
      default:
        return false;
    }
  };
};
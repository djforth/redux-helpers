import updateState from './update_state';

import {
  closeModal
  , openModal
} from './open_close';

export default (types)=>{
  let {CLOSE, OPEN} = types;
  return (state, action)=>{
    let update_state = updateState(state);
    switch (action.type){
      case CLOSE:
        return closeModal(update_state);
      case OPEN:
        return openModal(update_state, action.id);
      default:
        return false;
    }
  };
};

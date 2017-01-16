
export default (action, type)=>{
  action = action.toUpperCase();
  type = type.toUpperCase();
  return {
    URL: `${action}_${type}_URL`
    , SEND: `${action}_SEND_${type}`
    , SUCCESS: `${action}_SUCCESS_${type}`
    , FAIL: `${action}_FAIL_${type}`
  };
};

export const ModalActions = (type)=>{
  type = type.toUpperCase();
  return {
    CLOSE: `CLOSE_${type}`
    , OPEN: `OPEN_${type}`
  };
};

export const FetchActions = (type)=>{
  type = type.toUpperCase();
  return {
    URL: `${type}_URL`
    , REQUEST: `REQUEST_${type}`
    , RECEIVE: `RECEIVE_${type}`
  };
};

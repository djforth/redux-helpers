import Fetch from '@djforth/ajax-es6-fp/fetch';
import _ from 'lodash/core';

export const Request = (TYPE)=>{
  return ()=>{
    return {
      type: TYPE
      , isFetching: true
    };
  };
};

export const Receive = (TYPE)=>{
  return (json)=>{
    return {
      type: TYPE
      , data: json
      , isFetching: false
      , receivedAt: Date.now()
    };
  };
};

function additionalDispatcher(additional){
  if (!(_.isArray(additional) || _.isFunction(additional))) return null;

  return function(dispatch, data){
    // data = Immutable.fromJS(data)
    if (_.isFunction(additional)){
      dispatch(additional(data));
      return;
    }

    additional.forEach((a)=>{
      dispatch(a(data));
    });
  };
}

export const FetchData = (request, receive, additional)=>{
  let addDispatcher = additionalDispatcher(additional);
  return (url, sucMsg, errMsg)=>{
    var get_data = Fetch(url);
    return (dispatch)=>{
      dispatch(request());
      return get_data()
        .then((json)=>{
          dispatch(receive(json));
          if (!_.isNull(addDispatcher)){
            addDispatcher(dispatch, json);
          }
        })
        .catch((err)=>{
          /* eslint-disable */
          console.log(err);
          /* eslint-enable */
        });
    };
  };
};

export const FetchAction = (receive_type, request_type, additonal)=>{
  let requester = Request(request_type);
  let receiver = Receive(receive_type);
  return FetchData(requester, receiver, additonal);
};

export const addUrl = (TYPE)=>{
  return (url)=>{
    return {
      type: TYPE
      , url
    };
  };
};

export const Get = (getFetchURL, RECEIVE, REQUEST)=>()=>{
  let fetcher = FetchAction(RECEIVE, REQUEST);

  return (dispatch, getState)=>{
    let url = getFetchURL(getState());
    return dispatch(fetcher(url));
  };
};

export default ()=>'fetch';

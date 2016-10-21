let Patch = require('@djforth/ajax-es6-fp/patch');

export const Send = (TYPE)=>{
  return ()=>{
    return {
      type: TYPE
      , didError: false
      , isUpdating: true
    };
  };
};

export const Success = (TYPE)=>{
  return (succ)=>{
    return {
      type: TYPE
      , item: succ
      , receivedAt: Date.now()
      , isUpdating: false
    };
  };
};

export const Fail = (TYPE)=>{
  return (err)=>{
    return {
      type: TYPE
      , didError: true
      , errors: err
      , receivedAt: Date.now()
      , isUpdating: false
    };
  };
};

export const UpdateData = (send, success, fail)=>{
  return (url, data, id)=>{
    var update_data = Patch(url);
    return (dispatch)=>{
      dispatch(send());

      return update_data(data, id)
        .then((json)=>{
          dispatch(success(json));
        })
        .catch((err, status)=>{
          dispatch(fail(err, status));
        });
    };
  };
};

export const UpdateAction = (fail_type, send_type, processor)=>{
  const failer = Fail(fail_type);
  const sender = Send(send_type);

  return UpdateData(
    sender
    , processor
    , failer
  );
};

export const addUpdateUrl = (TYPE)=>{
  return (url)=>{
    return {
      type: TYPE
      , url
    };
  };
};

export default ()=>'update';

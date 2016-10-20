let Destroy = require('@djforth/ajax-es6-fp/destroy');

export const Send = (TYPE)=>{
  return ()=>{
    return {
      type: TYPE
      , didError: false
      , isDeleting: true
    };
  };
};

export const Success = (TYPE)=>{
  return (id)=>{
    return {
      type: TYPE
      , id: id
      , receivedAt: Date.now()
      , isDeleting: false
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
      , isDeleting: false
    };
  };
};

export const DestroyData = (send, success, fail, type = 'Item')=>{
  return (url, data, id = null)=>{
    var destroy_data = Destroy(url);
    return (dispatch)=>{
      dispatch(send());
      return destroy_data(id, data)
        .then(()=>{
          dispatch(success(id));
        })
        .catch((err)=>{
          dispatch(fail(err));
        });
    };
  };
};

export const DestroyAction = (fail_type, send_type, processor)=>{
  const failer = Fail(fail_type);
  const sender = Send(send_type);

  return DestroyData(
    sender
    , processor
    , failer
  );
};

export const addDestroyUrl = (TYPE)=>{
  return (url)=>{
    return {
      type: TYPE
      , url
    };
  };
};

export default ()=>'update';

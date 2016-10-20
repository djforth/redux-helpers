import Create from '@djforth/ajax-es6-fp/create';

export const Send = (TYPE)=>{
  return ()=>{
    return {
      type: TYPE
      , isCreating: true
    };
  };
};

export const Success = (TYPE)=>{
  return (succ)=>{
    return {
      type: TYPE
      , item: succ
      , receivedAt: Date.now()
      , isCreating: false
    };
  };
};

export const Fail = (TYPE)=>{
  return (err)=>{
    return {
      type: TYPE
      , errors: err
      , receivedAt: Date.now()
      , isCreating: false
    };
  };
};

export const CreateData = (send, success, fail, type = 'Item')=>{
  return (url, data)=>{
    var create_data = Create(url);
    return (dispatch)=>{
      dispatch(send());
      return create_data(data)
        .then((json)=>{
          dispatch(success(json));
        })
        .catch((err)=>{
          dispatch(fail(err));
        });
    };
  };
};

export const CreateAction = (fail_type, send_type, processor)=>{
  const failer = Fail(fail_type);
  const sender = Send(send_type);

  return CreateData(
    sender
    , processor
    , failer
  );
};

export const addCreateUrl = (TYPE)=>{
  return (url)=>{
    return {
      type: TYPE
      , url
    };
  };
};

export default ()=>'create';

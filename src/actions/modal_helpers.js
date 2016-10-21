export const Open = (type)=>(id)=>{
  return {
    type
    , id
  };
};

export const Edit = (Opener)=>(id)=>{
  return (dispatch)=>{
    dispatch(Opener(id));
  };
};

export const Close = (type)=>()=>{
  return {
    type
  };
};

export default (open_type, close_type)=>{
  let open = Open(open_type);
  let edit = Edit(open);
  let close = Close(close_type);
  return {
    close, edit, open
  };
};

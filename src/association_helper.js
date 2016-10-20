
export const Create = (type)=>(data)=>{
  return {
    type
    , data
  };
};

export const Update = (type)=>(id)=>{
  return {
    type
    , id
  };
};

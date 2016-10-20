import _ from 'lodash/core';

export default (dispatch)=>{
  return (data, creator, type)=>{
    let obj = {};

    if (_.isString(data)){
      obj[`${type}_title`] = data;
      obj[`${type}_id`] = null;

      if (_.isFunction(creator)){
        dispatch(creator({title: data}));
      }

      return obj;
    }

    obj[`${type}_id`] = data;
    return obj;
  };
};

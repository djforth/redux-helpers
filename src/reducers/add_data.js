import Immutable from 'immutable';
import updateState from './update_state';
import _ from 'lodash/core';

function createItem(data){
  data = Object.assign({}, data, {
    id: _.uniqueId('new')
    , creating: true
  });
  return Immutable.fromJS(data);
}

function removeExistingInCreating(items){
  return items.filterNot((i)=>i.get('creating'));
}

export const addItem = (state, data)=>{
  let update_state = updateState(state);
  let {items} = state;
  // Clear existing creating items
  items = removeExistingInCreating(items);
  items = items.push(createItem(data));
  return update_state({
    items
  });
};

export const updateItemId = (state, id)=>{
  let update_state = updateState(state);
  let {items} = state;
  items = items.map((item)=>{
    if (item.get('creating') && !_.isNull(id)){
      return item.map((v, k)=>{
        if (k === 'id') return id;
        if (k === 'creating') return false;
        return v;
      });
    }
    return item;
  });

  return update_state({
    items
  });
};

// For Testing
export default ()=>'Add Data';

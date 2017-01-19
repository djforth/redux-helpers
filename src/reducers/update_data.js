import updateState from './update_state';
import forIn from 'lodash/forIn';

export const addUpdateUrl = (update_state, update_url)=>{
  return update_state({update_url});
};

export const failUpdate = (update_state, errors, receivedAt)=>{
  return update_state({
    isUpdating: false
    , didError: true
    , errors: errors
    , lastUpdated: receivedAt
  });
};

export const sendUpdate = (update_state)=>{
  return update_state({
    isUpdating: true
    , didError: false
    , errors: null
  });
};

function update_item(items, updated_data){
  let item = items.find((item)=>item.get('id') === updated_data.id);
  if (!item) return items;
  let index = items.indexOf(item);
  forIn(updated_data, (v, k)=>{
    item = item.set(k, v);
  });
  return items.set(index, item);
}

export const successUpdate = (state, item, receivedAt)=>{
  let update_state = updateState(state);
  let {items} = state;
  items = update_item(items, item);
  return update_state({
    isUpdating: false
    , didError: false
    , errors: null
    , items
    , lastUpdated: receivedAt
  });
};

// For Testing
export default ()=>'Update Data';

import updateState from './update_state';

export const addDestroyUrl = (update_state, destroy_url)=>{
  return update_state({destroy_url});
};

export const failDestroy = (update_state, errors, receivedAt)=>{
  return update_state({
    isDestroying: false
    , didError: true
    , errors: errors
    , lastUpdated: receivedAt
  });
};

export const sendDestroy = (update_state)=>{
  return update_state({
    isDestroying: true
    , didError: false
    , errors: null
  });
};

function destroy_item(items, id){
  let item = items.find((item)=>item.get('id') === id);
  if (!item) return items;
  let index = items.indexOf(item);
  return items.delete(index);
}

export const successDestroy = (state, id, receivedAt)=>{
  let update_state = updateState(state);
  let {items} = state;
  items = destroy_item(items, id);
  return update_state({
    isDestroying: false
    , didError: false
    , errors: null
    , items
    , lastUpdated: receivedAt
  });
};

// For Testing
export default ()=>'Destroy Data';

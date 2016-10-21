
export const openModal = (update_state, id)=>{
  return update_state({
    editing: id
    , open: true
  });
};

export const closeModal = (update_state)=>{
  return update_state({
    editing: null
    , didError: false
    , errors: null
    , open: false
  });
};

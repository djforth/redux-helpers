export default function updateState(state){
  return function(update){
    return Object.assign({}, state, update);
  };
}

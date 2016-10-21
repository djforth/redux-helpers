import Immutable from 'immutable';

export default function setDefaults(defaults){
  return (state)=>{
    // Doing this way because of how Redux deals with initialState (see scriptWriterApp)
    return Object.assign({}, defaults, state);
  };
}

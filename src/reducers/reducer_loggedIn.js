import {SIGNED_IN} from '../actions/type';
export default function(state='',action){
  switch(action.type){
    case SIGNED_IN:
    return action.payload;
    default:
    return state;
  }
}

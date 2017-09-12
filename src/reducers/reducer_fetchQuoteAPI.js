import {FETCH_QUOTE_API} from '../actions/type';

export default function(state = '', action){
switch(action.type){
  case FETCH_QUOTE_API:
  return action.payload;
  default:
  return state;
}
}

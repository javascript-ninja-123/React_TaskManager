import {FETCH_GITHUB_API} from '../actions/type';

export default function(state = [],action){
switch(action.type){
  case FETCH_GITHUB_API:
  return action.payload;
  default:
  return state;
}
}

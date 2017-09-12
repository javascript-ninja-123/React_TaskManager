import {FETCH_FRONTEND_COMPLETED} from '../actions/type';
export default function(state =[],action){
  switch(action.type){
    case FETCH_FRONTEND_COMPLETED:
    return action.payload;
    default:
    return state;
  }
}

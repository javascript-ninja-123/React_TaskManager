import {FETCH_FRONTEND,SORT_BY_DATE,SORT_BY_PRIORITY} from '../actions/type';
export default function(state = [],action){
  switch(action.type){
    case FETCH_FRONTEND:
    return action.payload;
    case SORT_BY_PRIORITY:
    return action.payload;
    case SORT_BY_DATE:
    return action.payload;
    default:
    return state;
  }
}

import {PUSH_NEW_MEETING} from '../actions/type';

export default function(state=[],action){
  switch(action.type){
    case PUSH_NEW_MEETING:
    let newPayload = action.payload.map(value => {
      let startDate = new Date(value.start),
      endDate = new Date(value.end)
      return {
        start:startDate,
        end:endDate,
        title:value.title
      }
    })
    return newPayload
    default:
    return state
  }
}

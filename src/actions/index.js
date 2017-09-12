import axios from 'axios';
import moment from 'moment';
import {FETCH_QUOTE_API,SIGNED_IN,FETCH_FRONTEND,SORT_BY_DATE,SORT_BY_PRIORITY,FETCH_GITHUB_API
,FETCH_FRONTEND_COMPLETED,PUSH_NEW_MEETING} from './type'
import {firebaseApp} from '../firebase';
const ref = firebaseApp.database().ref();
//frontend
const frontEnd = ref.child('frontend');
const frontEndInComplete = frontEnd.child('incomplete');
const frontEndComplete = frontEnd.child('complete');
//backend
const backEnd = ref.child('backend');
const backEndInComplete = backEnd.child('incomplete');
const backEndComplete = backEnd.child('complete');

//CALENDAR
const calendar = ref.child('calendar');


//get quote API Fetch
export function getQuoteAPI(){
  var URL = 'https://talaikis.com/api/quotes/'
  const request = axios.get(URL,{
    headers: {
    'Content-type': 'application/json'
  }
  })
  return dispatch => {
    request
    .then(({data}) => {
        const singleQuote =
        data.find(value => {
          if(value.quote.length <101) return value
        });
        const quote = singleQuote.quote;
        dispatch({
          type:FETCH_QUOTE_API,
          payload:quote
        })
    })
  }
}
//fetch Github Commit
export function fetchGithubAPI(repo){
  const TOKEN ='56d60d32cacb1708ecb91574d90e61aa727eebb1';
  const url = `https://api.github.com/repos/tjdalsvndn9/${repo}/commits?per_page=3?access_token=${TOKEN}`;
  const request = axios.get(url);
  return dispatch => {
    request
    .then(({data})=> {
      let result = data.map(value => {
        return {
          commit:value.commit,
          // when I change it other repo, avatar does not work
          // avatarURL:value.author.avatar_url,
          htmlURL:value.html_url
        }
      })
      let SplicedResult = result.splice(0,3)
      console.log(SplicedResult)
      dispatch({
        type:FETCH_GITHUB_API,
        payload:SplicedResult
      })
    })
  }
}
//firebase auth email
export function LoggedIn(email){
  return{
    type:SIGNED_IN,
    payload:email
  }
}

//firebase front end fetch
export function fetchFrontEnd(){
  return dispatch => {
    frontEndInComplete.once('value', snap => {
      let snapshot = snap.val();
      let tasks = Object.values(snapshot);
      dispatch({
        type:FETCH_FRONTEND,
        payload:tasks
      })
    })
  }
}


export function addFrontEnd(task,dueDate,priority,textarea){
  var dueDateIndex;
  let dueDateVaule = moment(new Date(dueDate)).fromNow()
  if(dueDateVaule.includes('month') || dueDateVaule.includes('months')){
     dueDateIndex = String(dueDateVaule).replace(/[a-zA-Z]/g, ' ').trim();
    dueDateIndex = parseInt(dueDateIndex) * 30;
  }
  else if(dueDateVaule.includes('year') || dueDateVaule.includes('years')){
    dueDateIndex = String(dueDateVaule).replace(/[a-zA-Z]/g, ' ').trim();
   dueDateIndex = parseInt(dueDateIndex) * 365;
 }else{
   dueDateIndex = parseInt(String(dueDateVaule).replace(/[a-zA-Z]/g, ' ').trim());
 }
  let taskId = frontEndInComplete.push().key;
  let data = {
    id:taskId,
    task,
    textarea,
    isWorking:false,
    date:moment(dueDate).format('LL'),
    dueDate:[dueDateIndex,dueDateVaule],
    priority
  }
  return dispatch => frontEndInComplete.push(data)
}

export function updateFrontEnd(newRating,ratingText,id){
  return dispatch => {
    let updateEle = frontEndInComplete.orderByChild('id').equalTo(id).once('child_added')
    .then(snap => {
      let snapshot = snap.val()
      snap.ref.update({
        priority:[newRating -1,ratingText]
      })
    })
    let newPromise = new Promise(resolve=> {
      resolve(updateEle)
    })
    newPromise
    .then(() => {
      frontEndInComplete.once('value', snap => {
        let snapshot = snap.val();
        let tasks = Object.values(snapshot);
        dispatch({
          type:FETCH_FRONTEND,
          payload:tasks
        })
      })
    })
  }
}

export function removeFrontEnd(id){
  return dispatch => {
  let removeEle =   frontEndInComplete.orderByChild('id').equalTo(id).once('child_added')
    .then(snap => {
      snap.ref.remove();
    })
  let newPromie = new Promise(resolve => {
    resolve(removeEle)
  })
  newPromie
  .then(() => {
    frontEndInComplete.once('value', snap => {
      let snapshot = snap.val();
      let tasks = Object.values(snapshot);
      dispatch({
        type:FETCH_FRONTEND,
        payload:tasks
      })
    })
  })
  }
}

export function workingFrontend(id,working){
  return dispatch => {
    let updateEle = frontEndInComplete.orderByChild('id').equalTo(id).once('child_added')
    .then(snap => {
      if(working === true){
        snap.ref.update({
          isWorking:false
        })
      }else{
        snap.ref.update({
          isWorking:true
        })
      }
    })
    let newPromie = new Promise(resolve => {
      resolve(updateEle)
    })
    newPromie
    .then(() => {
      frontEndInComplete.once('value', snap => {
        let snapshot = snap.val();
        let tasks = Object.values(snapshot);
        dispatch({
          type:FETCH_FRONTEND,
          payload:tasks
        })
      })
    })
  }
}

export function movetoNewRefFrontEnd(id){
  return dispatch => {
    let moveEle = frontEndInComplete.orderByChild('id').equalTo(id).once('child_added')
    .then(snap => {
      let snapshot = snap.val();
      frontEndComplete.push(snapshot)
      .then(() => {
        snap.ref.remove();
      })
      .catch(err => console.error(err))
    })
    let newPromie = new Promise(resolve => {
      resolve(moveEle)
    })
    newPromie
    .then(() => {
      frontEndInComplete.once('value', snap => {
        let snapshot = snap.val();
        let tasks = Object.values(snapshot);
        dispatch({
          type:FETCH_FRONTEND,
          payload:tasks
        })
      })
    })
  }
}


export function fetchfrontEndCompleted(){
  return dispatch => {
    frontEndComplete.once('value',snap => {
      let snapshot = snap.val();
      let tasks = Object.values(snapshot);
      dispatch({
        type:FETCH_FRONTEND_COMPLETED,
        payload:tasks
      })
    })
  }
}

//firebase sorting
export function sortByPriority(sort){
  return dispatch => {
    frontEnd.once('value')
    .then(snap => {
      let snapshot = snap.val();
      let tasks = Object.values(snapshot);
      if(sort === 'Priority'){
        let finalResult = tasks.sort((a,b) => {
          return b.priority[0] - a.priority[0]
        })
        dispatch({
          type:SORT_BY_PRIORITY,
          payload:finalResult
        })
      }
    else if(sort === 'Date'){
        let finalResult = tasks.sort((a,b) => {
          return a.dueDate[0] - b.dueDate[0]
        })
        dispatch({
          type:SORT_BY_DATE,
          payload:finalResult
        })
      }
    })
    .catch(err => console.warn(err))
  }
}


//firebase backend




//calendar function
export function convertDateandPush(startdate,enddate,title){
  // startdate = new Date(startdate)
  // enddate = new Date(enddate)
  let date = {
    title,
    start:startdate,
    end:enddate
  };
  return dispatch => calendar.push(date);
}

export function fetchCalendarEvents(){
  return dispatch => {
    calendar.once('value')
    .then(snap => {
      let snapshot = snap.val();
      let result = Object.values(snapshot)
      dispatch(
      {
        type:PUSH_NEW_MEETING,
        payload:result
      }
      )
    })
  }
}

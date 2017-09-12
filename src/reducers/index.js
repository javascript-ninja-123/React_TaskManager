import { combineReducers } from 'redux';
import fetechQuoteAPIReducer from './reducer_fetchQuoteAPI'
import loggedInReducer from './reducer_loggedIn';
import fetchFirebaseReducer from './reducer_fetchFirebase';
import fetchGitHubAPIReducer from './reducer_fetchGithubAPI';
import fetchNewRefReducer from './reducer_fetchNewRefFirebase';
import CalendarReducer from './reducer_calendar';
const rootReducer = combineReducers({
  quote:fetechQuoteAPIReducer,
  email:loggedInReducer,
  fetchFirebase:fetchFirebaseReducer,
  github:fetchGitHubAPIReducer,
  newRef:fetchNewRefReducer,
  date:CalendarReducer
});

export default rootReducer;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch  } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux';
import {firebaseApp} from './firebase';
import reducers from './reducers';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';


//components
import APP from './App';
import SIGNUP from './components/Signup/Signup';
import SIGNIN from './components/Signin/Signin';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

firebaseApp.auth().onAuthStateChanged(user => {
  if(user) console.log('user is signed in', user.email)
  else {
    console.log('user has signed out')
  }
})




ReactDOM.render(
<Provider store={createStoreWithMiddleware(reducers)}>
  <BrowserRouter>
    <div>
      <Switch>
        <Route path='/app' component={APP}/>
        <Route path='/signup' component={SIGNUP}/>
        <Route path='/' component={SIGNIN}/>
      </Switch>
    </div>
  </BrowserRouter>
</Provider>
  , document.getElementById('root'));
registerServiceWorker();

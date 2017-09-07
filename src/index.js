import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';


//components
import App from './App';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);


ReactDOM.render(
<Provider store={createStoreWithMiddleware(reducers)}>
  <BrowserRouter>
    <div>
      <Switch>
        <Route path='/' component={App}/>
      </Switch>
    </div>
  </BrowserRouter>
</Provider>
  , document.getElementById('root'));
registerServiceWorker();

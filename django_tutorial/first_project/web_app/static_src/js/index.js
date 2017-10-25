import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'
import logger from 'redux-logger'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import rootReducer, { getFeatureState } from './redux/root'
import { fetchFeatures } from './redux/feature'

import App from './views/containers/App'

if (process.env.NODE_ENV === `development`) {
  const { logger } = require(`redux-logger`);
}

/** main entry point for the initialization; should be called by google maps API once its JS is loaded */
window.init = function() {

  const middleware = [ReduxThunk]

  middleware.push(logger);

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(...middleware)))

  ReactDOM.render(
    <Provider store={store}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )

  // kick off an action which sets the district and region types to their defaults and loads the region data
  store.dispatch(fetchFeatures(getFeatureState(store.getState())))
}


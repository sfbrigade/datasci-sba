import { createStore, applyMiddleware, compose } from 'redux'
import ReduxThunk from 'redux-thunk'

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import rootReducer, { getRegionState } from './redux/root'
import { fetchRegions } from './redux/regions'

import App from './views/containers/App'


/** main entry point for the initialization; should be called by google maps API once its JS is loaded */
window.init = function() {

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(ReduxThunk)))

  ReactDOM.render(
    <Provider store={store}>
      <App/>
    </Provider>,
    document.getElementById('root')
  )

  // kick off an action which sets the district and region types to their defaults and loads the region data
  store.dispatch(fetchRegions(getRegionState(store.getState())))
}


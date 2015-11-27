import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory'
import { syncReduxAndRouter, routeReducer } from 'redux-simple-router';
import { Provider } from 'react-redux';
import { fromJS } from 'immutable';
import * as reducers from 'reducers';
import routes from 'routes';
import promiseMiddleware from 'lib/promiseMiddleware';
import immutifyState from 'lib/immutifyState';
import { compose, createStore, combineReducers, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import { DevTools, DebugPanel, LogMonitor } from 'redux-devtools/lib/react';
import 'babel-core/polyfill';
import 'event-source-polyfill';

const initialState = immutifyState(window.__INITIAL_STATE__);
const history = createBrowserHistory();
const reducer = combineReducers(
  Object.assign({},
                reducers,
                { routing: routeReducer }
               )
);
const finalCreateStore = compose(
  applyMiddleware(promiseMiddleware),
  devTools()
)(createStore);
const store = finalCreateStore(reducer, initialState);

syncReduxAndRouter(history, store);

render(
  <div id="root">
    <Provider store={store}>
      <Router children={routes} history={history} />
    </Provider>
    <DebugPanel top right bottom>
      <DevTools store={store} monitor={LogMonitor} />
    </DebugPanel>
  </div>,
  document.getElementById('mount')
);

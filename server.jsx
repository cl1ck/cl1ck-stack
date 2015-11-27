import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server'
import { RoutingContext, match } from 'react-router';
import createLocation from 'history/lib/createLocation';
import routes from 'routes';
import { Provider } from 'react-redux';
import * as reducers from 'reducers';
import promiseMiddleware from 'lib/promiseMiddleware';
import fetchComponentData from 'lib/fetchComponentData';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import path from 'path';
import webpackDev from './webpack.dev';
import compression from 'compression';
const { syncReduxAndRouter, routeReducer } = require('redux-simple-router');

const app = express();
app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  webpackDev(app);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
}

app.use( (req, res) => {
  const location = createLocation(req.url);
  const reducer = combineReducers(reducers);
  const store = applyMiddleware(promiseMiddleware)(createStore)(reducer);

  match({ routes, location }, (err, redirectLocation, renderProps) => {
    if (err) {
      console.error(err);
      return res.status(500).end('Internal server error');
    }

    if (!renderProps) {
      return res.status(404).end('Not found');
    }

    function renderView() {
      const InitialView = (
        <div id="root">
          <Provider store={store}>
            <RoutingContext {...renderProps} />
          </Provider>
        </div>
      );

      const componentHTML = renderToString(InitialView);

      const initialState = store.getState();

      const HTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>cl1ck-stack</title>

          <script>
            window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
          </script>
        </head>
        <body>
          <div id="mount">${componentHTML}</div>
          <script type="application/javascript" src="/bundle.js"></script>
        </body>
      </html>`;

      return HTML;
    }

    fetchComponentData(store.dispatch, renderProps.components, renderProps.params)
      .then(renderView)
      .then(html => res.end(html))
      .catch(err => {
        res.end(err.message);
        console.log(err.message);
      });
  });
});

export default app;

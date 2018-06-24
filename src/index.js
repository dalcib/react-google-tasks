/* eslint-disable */
import React from 'react'
import ReactDOM from 'react-dom'
// @ts-ignore
import { Router, Route, browserHistory, Redirect, IndexRoute } from 'react-router'
import './index.css'

//import SessionActions from './actions/SessionActions'
//import SessionStore from './stores/SessionStore'

import sessionStore from './stores/Session'

import App from './App'
import LoggedInLayout from './components/LoggedInLayout'
import AboutPage from './components/AboutPage'

import LoginPage from './containers/LoginPageContainer'
import TaskListsPage from './containers/TaskListsPageContainer'
import TasksPage from './containers/TasksPageContainer'

window.handleGoogleApiLoaded = () => {
  sessionStore.authorize(true, renderApp)
}

class Root extends React.Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Redirect from="/" to="/login" />
        <Route path="/" component={App}>
          <Route path="/login" component={LoginPage} />
          <Route component={LoggedInLayout} onEnter={requireAuth}>
            <Route path="/lists" component={TaskListsPage}>
              <IndexRoute component={AboutPage} />
              <Route path="/lists/:id" component={TasksPage} />
            </Route>
          </Route>
        </Route>
      </Router>
    )
  }
}

function renderApp() {
  ReactDOM.render(<Root />, document.getElementById('root'))
}

function requireAuth(nextState, replace) {
  if (!sessionStore.isLoggedIn) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname },
    })
  }
}

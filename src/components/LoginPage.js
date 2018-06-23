import React, { Component } from 'react'
// @ts-ignore
import image from '../../img/desk.png'
import PropTypes from 'prop-types'
import './LoginPage.css'

import RaisedButton from 'material-ui/RaisedButton'

class LoginPage extends Component {
  render() {
    return (
      <div className="LoginPage">
        <div className="LoginPage__banner">
          <div className="LoginPage__text">
            <h1>Almost Google Tasks</h1>
            <p>Organize your life!</p>
            <RaisedButton
              className="login-button"
              label="Log In with Google"
              onClick={this.props.onLogin}
            />
          </div>
          <img src={image} alt="Login Google Tasks" className="LoginPage__image" />
        </div>
      </div>
    )
  }
}

LoginPage.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default LoginPage

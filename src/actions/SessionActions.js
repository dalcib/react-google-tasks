import AppDispatcher from '../dispatcher/AppDispatcher'
import AppConstants from '../constants/AppConstants'

import api from '../api/index'

const SessionActions = {
  authorize(immediate = false, callback) {
    console.log('authorize')
    api
      .authorize({ immediate })
      .then(() => {
        console.log('authorizeOK')
        AppDispatcher.dispatch({
          type: AppConstants.SESSION_AUTHORIZE_SUCCESS,
        })

        if (callback) callback()
      })
      .catch(err => {
        console.log('authorizeERRRRRR')
        AppDispatcher.dispatch({
          type: AppConstants.SESSION_AUTHORIZE_FAIL,
          error: err,
        })

        if (callback) callback()
      })
  },

  logout() {
    return new Promise((resolve, reject) => {
      api
        .logout()
        .then(() => {
          AppDispatcher.dispatch({
            type: AppConstants.SESSION_LOGOUT_SUCCESS,
          })
          resolve()
        })
        .catch(error => reject(error))
    })
  },
}

export default SessionActions

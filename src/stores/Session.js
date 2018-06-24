import { observable, action, runInAction } from 'mobx'
import api from '../api/index'

class Session {
  @observable isLoggedIn = false

  @action
  authorize(immediate = false, callback) {
    api
      .authorize({ immediate })
      .then(() => {
        runInAction(() => {
          this.isLoggedIn = true
        })

        if (callback) callback()
      })
      .catch(err => {
        runInAction(() => {
          this.isLoggedIn = false
        })
        if (callback) callback()
      })
  }

  logout() {
    return new Promise((resolve, reject) => {
      api
        .logout()
        .then(() => {
          runInAction(() => {
            this.isLoggedIn = false
          })
          resolve()
        })
        .catch(error => reject(error))
    })
  }
}

const sessionStore = new Session()

export default sessionStore

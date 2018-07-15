// @ts-nocheck
/* eslint-disable */
import { CLIENT_ID } from '../config'
import { logInAsync } from '../api/Google'
const SCOPES = ['email', 'profile', 'https://www.googleapis.com/auth/tasks']

export default {
  access_token: null,

  async authorize() {
    try {
      const result = await logInAsync({ scopes: SCOPES, webClientId: CLIENT_ID })
      if (result.type === 'success') {
        this.access_token = result.accessToken
      } else {
        return { cancelled: true }
      }
    } catch (e) {
      return { error: true }
    }
  },

  async tasksApi(params) {
    const { method, url, body } = params
    const urlc = 'https://www.googleapis.com/tasks/v1' + url
    let headers = { Authorization: 'Bearer ' + this.access_token }
    if (method !== 'GET') {
      headers['Content-Type'] = 'application/json'
      headers['Content-Length'] = JSON.stringify(body).length
    }
    const result = await fetch(urlc, {
      method: method,
      headers: new Headers(headers),
      body: JSON.stringify(body),
    })
    console.log(params, result)
    if (result.ok) {
      return await result.json()
    }
    throw new Error(result.error)
  },

  logout() {
    return new Promise((resolve, reject) => {
      const token = gapi.auth.getToken()
      if (token) {
        const accessToken = gapi.auth.getToken().access_token
        fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`, {
          mode: 'no-cors',
        })
          .then(res => {
            gapi.auth.signOut()
            resolve()
          })
          .catch(error => reject(error))
      }
    })
  },

  listTaskLists() {
    return this.tasksApi('GET', '/users/@me/lists')
    //const request = gapi.client.tasks.tasklists.list()
    //return this.makeRequest(request)
  },

  showTaskList(taskListId) {
    return this.tasksApi('GET', '/users/@me/lists/' + taskListId)
    /* const request = gapi.client.tasks.tasklists.get({
      tasklist: taskListId,
    })
    return this.makeRequest(request) */
  },

  insertTaskList({ title }) {
    return this.tasksApi('POST', '/users/@me/lists', { title })
    /*     const request = gapi.client.tasks.tasklists.insert({
      title,
    })
    return this.makeRequest(request) */
  },

  updateTaskList({ taskListId, title }) {
    return this.tasksApi('PUT', '/users/@me/lists/' + taskListId, { title })
    /*     const request = gapi.client.tasks.tasklists.update({
      tasklist: taskListId,
      id: taskListId,
      title,
    })
    return this.makeRequest(request) */
  },

  deleteTaskList({ taskListId }) {
    return this.tasksApi('PUT', '/users/@me/lists/' + taskListId)
    /*     const request = gapi.client.tasks.tasklists.delete({
      tasklist: taskListId,
    })
    return this.makeRequest(request) */
  },

  listTasks(taskListId) {
    return this.tasksApi('GET', '/lists/' + taskListId + '/tasks')
    /*     const request = gapi.client.tasks.tasks.list({
      tasklist: taskListId,
    })
    return this.makeRequest(request) */
  },

  getTask(taskListId, taskId) {
    return this.tasksApi('GET', '/lists/' + taskListId + '/tasks/' + taskId)
    /*     const request = gapi.client.tasks.tasks.list({
          tasklist: taskListId,
        })
        return this.makeRequest(request) */
  },

  insertTask({ taskListId, ...params }) {
    return this.tasksApi('POST', '/lists/' + taskListId + '/tasks', params)
    /*     return this.tasksApi( 'POST', '/lists/' + taskListId + '/tasks',  })
    const request = gapi.client.tasks.tasks.insert({
      tasklist: taskListId,
      ...params,
    })
    return this.makeRequest(request) */
  },

  updateTask({ taskListId, taskId, ...params }) {
    return this.tasksApi('PUT', '/lists/' + taskListId + '/tasks/' + taskId, {
      id: taskId,
      ...params,
    })
    /*     const request = gapi.client.tasks.tasks.update({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
      ...params,
    })
    return this.makeRequest(request) */
  },

  deleteTask({ taskListId, taskId }) {
    return this.tasksApi('DELETE', '/lists/' + taskListId + '/tasks/' + taskId)
    /*     const request = gapi.client.tasks.tasks.delete({
      tasklist: taskListId,
      task: taskId,
      id: taskId,
    })
    return this.makeRequest(request) */
  },

  makeRequest(requestObj) {
    return new Promise((resolve, reject) => {
      requestObj.execute(resp => (resp.error ? reject(resp.error) : resolve(resp.result)))
    })
  },
}

/* function asJson(response) {
  if (response.status >= 400) {
    const error = new Error(`Unexpected response status ${response.statusText}`);
    error.response = response;
    throw error;
  } else {
    return response.json();
  }
} */

/*  async init() {
    const gapi = window.gapi
    if (!gapi) {
      return
    }

    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', {
        callback: async () => {
          try {
            await this.initGoogleAuth(gapi)
            resolve()
          } catch (ex) {
            reject(ex)
          }
        },
        onerror: () => {
          reject('gapi.client failed to load')
        },
      })
    })
  },

  async initGoogleAuth(gapi) {
    await gapi.client.init({
      clientId: CLIENT_ID,
      scope: SCOPES, //"profile email https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file",
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest'],
      prompt: 'select_account',
    })

    const auth = gapi.auth2.getAuthInstance()

    // Get current user
    const googleUser = auth.currentUser.get()
    this.updateSigninStatus(googleUser)

    // Listen for changes to current user.
    auth.currentUser.listen(googleUser => {
      console.log('auth.currentUser.listen', googleUser)
      this.updateSigninStatus(googleUser)
    })
  }, */

/*gapi.auth.authorize(
        {
          client_id: CLIENT_ID,
          scope: SCOPES.concat(' '),
          immediate: params.immediate,
          //cookie_policy: 'single_host_origin',
          response_type: 'id_token permission',
        },
        authResult => {
          if (authResult.error) {
            return reject(authResult.error)
          }
          this.access_token = authResult.access_token
          this.token_type = authResult.token_type
          console.log(authResult)
          this.listTasksLists().then(result => console.log(result))
          
          return gapi.client.load('tasks', 'v1', () => resolve())
          //{gapi.client.load('plus', 'v1', () => resolve()) })
        }
      )*/

/* 
        authorizex(params) {
    return new Promise((resolve, reject) => {
      logInAsync({ scopes: SCOPES, webClientId: CLIENT_ID })
        .then(result => {
          console.log(result)
          if (result.type === 'success') {
            //return await result.json()
          } 
gapi.client.load('tasks', 'v1', () => resolve())
        })
        .catch (reject('Error'))
    })
  },
      */

/*   async listTasksLists() {
    return this.tasksApi( 'GET', '/users/@me/lists' })
  },

  async insertTasksList() {
    this.tasksApi( 'POST', '/users/@me/lists', { title: 'XXXXX' } })
  }, 

  async uploadNewFile() {
    const authToken = this.gapi.client.getToken()
    const formBoundary = '__' + RandomHelper.getRandomObjectId(32) + '__'
    const requestBody = this.createFileUploadBody(
      formBoundary,
      fileName,
      fileContent,
      fileContentType
    )
    const url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart'
    await fetch(url, {
      method: 'POST',
      headers: new Headers({
        Authorization: authToken.token_type + ' ' + authToken.access_token,
        Accept: 'application/json',
        'Content-Type': 'multipart/related; boundary=' + formBoundary,
        'Content-Length': requestBody.length,
      }),
      requestBody,
    })
  },
  */

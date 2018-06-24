//const Task = { id: '', text: '', notes?: '', due?: undefined || '', isCompleted: false, position: '' }
//https://developers.google.com/apis-explorer/#search/tasks/tasks/v1/

import { observable, action, runInAction } from 'mobx'
import api from '../api/index'

function formatTaskList(data) {
  return {
    id: data.id,
    name: data.title,
  }
}

class TaskList {
  @observable taskLists = []
  @observable currentTaskList = null
  @observable error = null

  @action
  loadTaskLists() {
    console.log('loadTaskLists')
    api
      .listTaskLists()
      .then(data => {
        runInAction(() => (this.taskLists = data.items.map(formatTaskList)))
        console.log('runInAction')
      })
      .catch(err => {
        runInAction(() => {
          this.taskLists = []
          this.error = err
          console.log('errrr')
        })
      })
  }

  @action
  loadTaskList(taskListId) {
    api
      .showTaskList(taskListId)
      .then(data => {
        runInAction(() => {
          this.currentTaskList = formatTaskList(data)
        })
      })
      .catch(err => {
        runInAction(() => (this.error = err))
      })
  }

  @action
  createTaskList(params) {
    api
      .insertTaskList({ title: params.name })
      .then(data => {
        const newTaskList = formatTaskList(data)
        runInAction(() => this.taskLists.push(newTaskList))
      })
      .catch(err => {
        runInAction(() => (this.error = err))
      })
  }

  @action
  updateTaskList(params) {
    api
      .updateTaskList({
        taskListId: params.taskListId,
        title: params.name,
      })
      .then(data => {
        runInAction(() => {
          const updatedTaskListIndex = this.taskLists.findIndex(
            taskList => taskList.id === params.taskListId
          )
          this.taskLists[updatedTaskListIndex] = formatTaskList(data)

          if (this.currentTaskList && this.currentTaskList.id === params.taskListId) {
            this.currentTaskList = formatTaskList(data)
          }
        })
      })
      .catch(err => {
        runInAction(() => (this.error = err))
      })
  }

  @action
  deleteTaskList(params) {
    api
      .deleteTaskList({ taskListId: params.taskListId })
      .then(data => {
        runInAction(() => {
          const deletedTaskListIndex = this.taskLists.findIndex(
            taskList => taskList.id === params.taskListId
          )
          this.taskLists.splice(deletedTaskListIndex, 1)

          if (this.currentTaskList && this.currentTaskList.id === params.taskListId) {
            this.currentTaskList = null
          }
        })
      })
      .catch(err => {
        runInAction(() => (this.error = err))
      })
  }
}

const taskListStore = new TaskList()

export default taskListStore

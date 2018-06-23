//const Task = { id: '', text: '', notes?: '', due?: undefined || '', isCompleted: false, position: '' }
//https://developers.google.com/apis-explorer/#search/tasks/tasks/v1/

import { observable, action } from 'mobx'
import api from '../api/index'

class TaskList {
  @observable taskLists = []
  @observable currentTaskList = null
  @observable error = null

  @action
  loadTaskLists() {
    api
      .listTaskLists()
      .then(data => {
        this.taskLists = data.items.map(formatTaskList)
      })
      .catch(err => {
        this.taskLists = []
        this.error = err
      })
  }

  @action
  loadTaskList(taskListId) {
    api
      .showTaskList(taskListId)
      .then(data => {
        this.currentTaskList = formatTaskList(data)
      })
      .catch(err => {
        this.error = err
      })
  }

  @action
  createTaskList(params) {
    api
      .insertTaskList({ title: params.name })
      .then(data => {
        const newTaskList = formatTaskList(data)
        this.taskLists.push(newTaskList)
      })
      .catch(err => {
        this.error = err
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
        const updatedTaskListIndex = this.taskLists.findIndex(
          taskList => taskList.id === params.taskListId
        )
        this.taskLists[updatedTaskListIndex] = formatTaskList(data)

        if (this.currentTaskList && this.currentTaskList.id === params.taskListId) {
          this.currentTaskList = formatTaskList(data)
        }
      })
      .catch(err => {
        this.error = err
      })
  }

  @action
  deleteTaskList(params) {
    api
      .deleteTaskList({ taskListId: params.taskListId })
      .then(data => {
        const deletedTaskListIndex = this.taskLists.findIndex(
          taskList => taskList.id === params.taskListId
        )
        this.taskLists.splice(deletedTaskListIndex, 1)

        if (this.currentTaskList && this.currentTaskList.id === params.taskListId) {
          this.currentTaskList = null
        }
      })
      .catch(err => {
        this.error = err
      })
  }
}

const taskList = new TaskList()

export default taskList

function formatTaskList(data) {
  return {
    id: data.id,
    name: data.title,
  }
}

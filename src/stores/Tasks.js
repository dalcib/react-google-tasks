import { observable, action, runInAction } from 'mobx'
import api from '../api/index'

function formatTask(data) {
  return {
    id: data.id,
    text: data.title,
    notes: data.notes,
    due: data.due ? new Date(data.due) : undefined,
    isCompleted: data.status === 'completed',
    position: data.position,
  }
}

function getErrorMessageByCode(code) {
  const errorMessages = {
    400: 'Cannot load task list',
  }
  return errorMessages[code] || 'Something bad happened'
}

class Tasks {
  @observable tasks = []
  @observable isLoading = true
  @observable error = null

  @action
  loadTasks(taskListId) {
    api
      .listTasks(taskListId)
      .then(data => {
        runInAction(() => (this.tasks = data.items.map(formatTask) || []))
      })
      .catch(err => {
        runInAction(() => (this.error = getErrorMessageByCode(err.error.code)))
      })
  }

  @action
  updateTaskStatus(params) {
    api
      .updateTask({
        taskListId: params.taskListId,
        taskId: params.taskId,
        status: params.isCompleted ? 'completed' : 'needsAction',
      })
      .then(data => {
        const updatedTaskIndex = this.tasks.findIndex(task => task.id === data.id)
        runInAction(() => (this.tasks[updatedTaskIndex] = formatTask(data)))
      })
      .catch(err => {
        runInAction(() => (this.error = getErrorMessageByCode(err.error.code)))
      })
  }

  @action
  updateTask(params) {
    const newDue = params.due
      ? new Date(params.due.getTime() - params.due.getTimezoneOffset() * 60000)
      : params.due

    api
      .updateTask({
        taskListId: params.taskListId,
        taskId: params.taskId,
        title: params.text,
        notes: params.notes,
        due: newDue,
      })
      .then(data => {
        const updatedTaskIndex = this.tasks.findIndex(task => task.id === params.taskId)
        runInAction(() => (this.tasks[updatedTaskIndex] = formatTask(data)))
      })
      .catch(err => {
        runInAction(() => (this.error = getErrorMessageByCode(err.error.code)))
      })
  }

  @action
  createTask(params) {
    const newTask = {
      taskListId: params.taskListId,
      title: params.text,
      notes: params.notes,
    }

    if (params.due) {
      newTask.due = new Date(
        params.due.getTime() - params.due.getTimezoneOffset() * 60000
      ).toISOString()
    }

    api
      .insertTask(newTask)
      .then(data => {
        const newTask = formatTask(data)
        runInAction(() => this.tasks.unshift(newTask))
      })
      .catch(err => {
        runInAction(() => (this.error = getErrorMessageByCode(err.error.code)))
      })
  }

  @action
  deleteTask(params) {
    api
      .deleteTask({ taskListId: params.taskListId, taskId: params.taskId })
      .then(data => {
        const deletedTaskIndex = this.tasks.findIndex(task => task.id === params.taskId)
        runInAction(() => this.tasks.splice(deletedTaskIndex, 1))
      })
      .catch(err => {
        runInAction(() => (this.error = getErrorMessageByCode(err.error.code)))
      })
  }
}

const tasksStore = new Tasks()

export default tasksStore

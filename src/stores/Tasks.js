import { observable, action } from 'mobx'
import api from '../api/index'

class Tasks {
  @observable tasks = []
  @observable isLoading = true
  @observable error = null

  @action
  loadTasks(taskListId) {
    api
      .listTasks(taskListId)
      .then(data => {
        this.tasks = data.items.map(formatTask) || []
      })
      .catch(err => {
        this.error = getErrorMessageByCode(err.error.code)
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
        this.tasks[updatedTaskIndex] = formatTask(data)
      })
      .catch(err => {
        this.error = getErrorMessageByCode(err.error.code)
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
        this.tasks[updatedTaskIndex] = formatTask(data)
      })
      .catch(err => {
        this.error = getErrorMessageByCode(err.error.code)
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
        this.tasks.unshift(newTask)
      })
      .catch(err => {
        this.error = getErrorMessageByCode(err.error.code)
      })
  }

  @action
  deleteTask(params) {
    api
      .deleteTask({ taskListId: params.taskListId, taskId: params.taskId })
      .then(data => {
        const deletedTaskIndex = this.tasks.findIndex(task => task.id === params.taskId)
        this.tasks.splice(deletedTaskIndex, 1)
      })
      .catch(err => {
        this.error = getErrorMessageByCode(err.error.code)
      })
  }
}

const tasks = new Tasks()

export default tasks

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

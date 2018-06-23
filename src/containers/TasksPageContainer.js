import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import tasks from '../stores/Tasks'
import taskList from '../stores/TaskList'
//import TasksActions from '../actions/TasksActions'
//import TaskListsActions from '../actions/TaskListsActions'
//import TasksStore from '../stores/TasksStore'
//import TaskListsStore from '../stores/TaskListsStore'

import TasksPage from '../components/TasksPage'
import TaskCreateModal from '../components/TaskCreateModal'

function getStateFromFlux() {
  return {
    tasks: tasks.tasks, //TasksStore.getTasks(),
    error: tasks.error, //TasksStore.getError(),
    isLoadingTask: tasks.isLoading, //TasksStore.isLoadingTasks(),
    taskList: taskList.currentTaskList || {}, //TaskListsStore.getCurrentTaskList() || {},
  }
}

@observer
class TasksPageContainer extends Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      ...getStateFromFlux(),
      isCreatingTask: false,
    }
  }

  componentWillMount() {
    tasks.loadTasks(this.props.params.id)
    taskList.loadTaskList(this.props.params.id)
  }

  /*   componentDidMount() {
    TasksStore.addChangeListener(this._onChange)
    TaskListsStore.addChangeListener(this._onChange)
  } */

  componentWillReceiveProps(nextProps) {
    if (this.props.params.id !== nextProps.params.id) {
      tasks.loadTasks(nextProps.params.id)
      taskList.loadTaskList(nextProps.params.id)
    }
  }

  /*   componentWillUnmount() {
    TasksStore.removeChangeListener(this._onChange)
    TaskListsStore.removeChangeListener(this._onChange)
  } */

  handleTaskStatusChange = (taskId, { isCompleted }) => {
    console.log('handleTaskStatusChange', taskId, isCompleted)
    tasks.updateTaskStatus({
      taskListId: this.props.params.id,
      taskId,
      isCompleted,
    })
  }

  handleTaskUpdate = (taskId, task) => {
    tasks.updateTask({
      taskListId: this.props.params.id,
      taskId: taskId,
      ...task,
    })
  }

  handleTaskDelete = taskId => {
    tasks.deleteTask({
      taskListId: this.props.params.id,
      taskId,
    })
  }

  handleAddTask = () => {
    this.setState({ isCreatingTask: true })
  }

  handleTaskCreateModalClose = () => {
    this.setState({ isCreatingTask: false })
  }

  handleTaskSubmit = task => {
    const taskListId = this.props.params.id

    tasks.createTask({ taskListId, ...task })

    this.setState({ isCreatingTask: false })
  }

  handleDeleteTaskList = () => {
    const isConfirmed = confirm(
      'All tasks in this Task List will be deleted too. Are you sure to delete this Task List?'
    )

    if (isConfirmed) {
      taskList.deleteTaskList({
        taskListId: this.props.params.id,
      })
      this.context.router.push('/lists')
    }
  }

  handleUpdateTaskList = ({ name }) => {
    taskList.updateTaskList({
      taskListId: this.props.params.id,
      name,
    })
  }

  render() {
    return (
      <div className="TasksPage">
        <TasksPage
          taskList={this.state.taskList}
          tasks={this.state.tasks}
          error={this.state.error}
          isLoadingTasks={this.state.isLoadingTask}
          onUpdateTaskList={this.handleUpdateTaskList}
          onAddTask={this.handleAddTask}
          onDeleteTaskList={this.handleDeleteTaskList}
          onTaskDelete={this.handleTaskDelete}
          onTaskStatusChange={this.handleTaskStatusChange}
          onTaskUpdate={this.handleTaskUpdate}
        />
        <TaskCreateModal
          isOpen={this.state.isCreatingTask}
          onSubmit={this.handleTaskSubmit}
          onClose={this.handleTaskCreateModalClose}
        />
      </div>
    )
  }

  _onChange = () => {
    this.setState(getStateFromFlux())
  }
}

TasksPageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default TasksPageContainer

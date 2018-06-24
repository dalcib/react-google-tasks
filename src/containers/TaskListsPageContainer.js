import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'

import taskListStore from '../stores/TaskList'
import sessionStore from '../stores/Session'

//import SessionActions from '../actions/SessionActions'
//import SessionStore from '../stores/SessionStore'

//import TaskListsStore from '../stores/TaskListsStore'
//import TaskListsActions from '../actions/TaskListsActions'

import TaskListCreateModal from '../components/TaskListCreateModal'
import TaskListsPage from '../components/TaskListsPage'

function getStateFromFlux() {
  if (!taskListStore.taskLists) {
    taskListStore.loadTaskLists()
  }
  return {
    taskLists: taskListStore.taskLists, //TaskListsStore.getTaskLists(),
  }
}

@observer
class TaskListsPageContainer extends Component {
  constructor(props, context) {
    super(props, context)
    taskListStore.loadTaskLists()
    this.state = {
      taskLists: taskListStore.taskLists,
      //...getStateFromFlux(),
      isCreatingTaskList: false,
    }
  }

  componentWillMount() {
    taskListStore.loadTaskLists()
  }

  componentDidMount() {
    console.log('componentDidMount', this.state)
    //taskListStore.loadTaskLists()
    //TaskListsStore.addChangeListener(this._onChange)
  }

  /* componentWillUnmount() {
    TaskListsStore.removeChangeListener(this._onChange)
  } */

  handleAddTaskList = () => {
    this.setState({ isCreatingTaskList: true })
  }

  handleTaskListCreateModalClose = () => {
    this.setState({ isCreatingTaskList: false })
  }

  handleTaskListSubmit = taskList => {
    taskList.createTaskList(taskList)

    this.setState({ isCreatingTaskList: false })
  }

  onLogOut = () => {
    sessionStore.logout().then(() => {
      if (!sessionStore.isLoggedIn) {
        this.context.router.replace('/login')
      }
    })
  }

  render() {
    console.log(this.state.taskLists, taskListStore.taskLists)
    return (
      <div>
        <TaskListsPage
          taskLists={this.state.taskLists}
          taskListStore={taskListStore}
          page={this.props.children}
          onAddTaskList={this.handleAddTaskList}
          onLogOut={this.onLogOut}
        />
        <TaskListCreateModal
          isOpen={this.state.isCreatingTaskList}
          onSubmit={this.handleTaskListSubmit}
          onClose={this.handleTaskListCreateModalClose}
        />
      </div>
    )
  }

  _onChange = () => {
    this.setState(getStateFromFlux())
  }
}

TaskListsPageContainer.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default TaskListsPageContainer

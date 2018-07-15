import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router'
import { observer } from 'mobx-react'
import './TaskListsPage.css'
//import taskListStore from '../stores/TaskList'

import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import HomeIcon from 'material-ui/svg-icons/action/home'
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app'
import FolderIcon from 'material-ui/svg-icons/file/folder'
import AddIcon from 'material-ui/svg-icons/content/add'

@observer
class TaskListsPage extends Component {
  render() {
    const { router } = this.context
    console.log('this.props.taskLists', this.props.taskLists)
    console.log('this.props.taskListStore', this.props.taskListStore)
    return (
      <div className="TaskListsPage">
        <div className="TaskListsPage__menu">
          <List className="TaskListsPage__list">
            <h3 className="TaskListsPage__title">Almost Google Tasks</h3>
            <Divider />

            <List className="TaskListsPage__list">
              <ListItem
                leftIcon={<HomeIcon />}
                primaryText="Home"
                onClick={router.push.bind(null, '/lists')}
              />
            </List>
            <Divider />
            <List className="TaskListsPage__list">
              <Subheader>Task Lists</Subheader>
              {this.props.taskListStore.taskLists &&
                this.props.taskListStore.taskLists.map(list => (
                  <Link
                    key={list.id}
                    to={`/lists/${list.id}`}
                    activeClassName="TaskListsPage__activeListPage"
                  >
                    <ListItem leftIcon={<FolderIcon />} primaryText={list.name} />
                  </Link>
                ))}
              <ListItem
                leftIcon={<AddIcon />}
                primaryText="Create new list"
                onClick={this.props.onAddTaskList}
              />
            </List>
            <Divider />
            <List className="TaskListsPage__list">
              <ListItem
                leftIcon={<ExitIcon />}
                primaryText="Log out"
                onClick={this.props.onLogOut}
              />
            </List>
          </List>
        </div>
        <div className="TaskListsPage__tasks">{this.props.page}</div>
      </div>
    )
  }
}
TaskListsPage.contextTypes = {
  router: PropTypes.object.isRequired,
}

export default TaskListsPage

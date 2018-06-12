import React, {Component} from 'react'
import {Route, Redirect} from 'react-router-dom'
import DashBoard from './dashboard'
import EventForm from '../eventForm'
import config from '../../config/index'
import http from '../../helper/http'

class Admin extends Component {
  constructor (props) {
    super(props)
    this.state = {
      event: false,
      isAuthenticated: false
    }
    this.handleEventClick = this.handleEventClick.bind(this)
  }

  componentDidMount () {
    http.post(`${config.url}api/admin/validate`, {'a': 'b'})
      .then((response) => {
        if (response.status === 200) {
          this.setState({isAuthenticated: true})
          this.props.history.push('/admin/dashboard')
        }
        if (response.status === 403) {
          this.setState({isAuthenticated: false})
          this.props.history.push('/admin')
        }
      })
  }

  handleEventClick (event) {
    this.setState({event})
  }
  render () {
    const {event, isAuthenticated} = this.state
    return (
      <div>
        {isAuthenticated
          ? <div>
            <Route exact path='/admin/dashboard' render={() => <DashBoard onEventClick={this.handleEventClick} />} />
            <Route exact path='/admin/create' component={EventForm} />
            <Route exact path='/admin/edit' render={() => <EventForm {...event} isEditMode />} />
            {event && <Redirect to={`/admin/edit`} />}
          </div>
          : <h2> Please login as admin</h2>
        }
      </div>
    )
  }
}

export default Admin

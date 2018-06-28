import React, {Component} from 'react'
import {Link} from 'react-router-dom'

import http from '../../helper/http'

import GoogleOauth from '../googleOauth'
import Logout from '../logout'

class Header extends Component {
  constructor (props) {
    super(props)
    this.init = this.init.bind(this)
    this.handleSigninSuccess = this.handleSigninSuccess.bind(this)
  }

  loadScript () { // this is needed to run init() when this script has loaded
    const script = document.createElement('script')
    script.src = 'https://apis.google.com/js/client:platform.js'
    script.onload = this.init
    script.id = 'google-login'
    document.head.appendChild(script)
  }

  componentWillMount () {
    this.loadScript()
  }

  init () {
    window.gapi.load('auth2', () => {
      const auth = window.gapi.auth2.getAuthInstance()
      auth.isSignedIn.listen((isLoggedIn) => {
        console.log('listen logs')
        const profile = auth.currentUser.get().getBasicProfile()
        if (isLoggedIn) {
          http.post(`api/user/auth`,
            {access_token: auth.currentUser.get().Zi.access_token,
              email: profile.getEmail()
            })
            .then(res => res.json())
            .then(result => {
              if (result.statusCode !== 401) {
                if (this.props.signinPopUp) {
                  this.props.handleSigninPopUp()
                }
                return this.handleSigninSuccess(profile)
              }
              return auth.disconnect()
            })
        }
      })
    })
  }

  handleSigninSuccess (googleUser) {
    this.props.onLoginSuccess(googleUser)
  }

  render () {
    console.log('component render')
    const {isLoggedin, onLogoutSuccess, profile, handleFirst, first, handleRedirect} = this.props
    return (
      <div className='hero'>
        <div className='hero-head card'>
          <div className='card-content level has-background-light'>
            <Link to='/' onClick={() => handleRedirect(window.location.pathname)}>
              <h2 className='title'>Bangalore JS</h2>
            </Link>
            {(!isLoggedin) ? <GoogleOauth />
              : <div className='level-right'>
                <div className='columns level-item'>
                  <Link to='/profile' onClick={() => handleRedirect(window.location.pathname)}>
                    <figure className='image is-48x48'>
                      <img className='is-rounded' src={
                        profile
                          ? (profile.display ? profile.image : ('https://ui-avatars.com/api/?name=' + profile.name.replace(' ', '+'))) : null} />
                    </figure>
                  </Link>
                  <div className='column'>
                    {profile ? profile.name : null}
                  </div>
                  <Logout onLogoutSuccess={onLogoutSuccess} handleFirst={handleFirst} first={first} />
                </div>
              </div>}
          </div>
        </div>
      </div>
    )
  }
}

export default Header

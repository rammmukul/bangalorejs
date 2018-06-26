import React from 'react'

const GoogleOauth = () => {
  // script needs to run when this component loads to identify the button
  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/client:platform.js'
  script.id = 'google-login'
  document.head.appendChild(script)
  return (
    <div className='g-signin2' data-onsuccess='onSignIn' data-width='94' data-height='36' />
  )
}

export default GoogleOauth

import auth0 from 'auth0-js'
import Promise from 'bluebird'
import { EventEmitter } from 'events'
import { browserHistory } from 'react-router'

import { isTokenExpired } from './jwtHelper'

export default class CustomAuth extends EventEmitter {
  constructor(clientID, domain) {
    super()
    this.auth0 = new auth0.WebAuth({
      clientID,
      domain,
      responseType: 'token id_token',
    })

    this.conn = 'Username-Password-Authentication'

    this.signup = this.signup.bind(this)
    this.login = this.login.bind(this)
    this.storeTokens = CustomAuth.storeTokens.bind(this)
    this.getProfileInfo = this.getProfileInfo.bind(this)

    this.auth0.signup = Promise.promisify(this.auth0.signup)
    this.auth0.client.login = Promise.promisify(this.auth0.client.login)
    this.auth0.client.userInfo = Promise.promisify(this.auth0.client.userInfo)
  }

  signup(email, password, connection = this.conn) {
    return this.auth0.signup({ connection, email, password })
  }

  login(username, password) {
    return this.auth0.client.login({
      realm: 'Username-Password-Authentication',
      username,
      password,
    })
  }

  getProfileInfo(accessToken) {
    return this.auth0.client.userInfo(accessToken)
  }

  static storeTokens({ accessToken, idToken }) {
    return new Promise((resolve, reject) => {
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('id_token', idToken)
      resolve(localStorage.getItem('access_token'))
    })
  }

  loggedIn() {
    const token = this.getToken()
    return !!token && !isTokenExpired(token)
  }


  setToken(accessToken, idToken) {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('id_token', idToken)
  }

  setProfile(profile) {
    localStorage.setItem('profile', JSON.stringify(profile))
    this.emit('profile_updated', profile)
  }

  getProfile() {
    const profile = localStorage.getItem('profile')
    return profile ? JSON.parse(localStorage.profile) : {}
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token')
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
  }
}

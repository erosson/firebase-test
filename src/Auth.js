import React, {Component} from 'react'
import firebase from 'firebase'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

// from web console > 'web setup', top right
firebase.initializeApp({
  apiKey: "AIzaSyA9FtfmUsc6bVj8wFlDUAaFCVEgnFxg4vY",
  authDomain: "fir-test-5ea52.firebaseapp.com",
  databaseURL: "https://fir-test-5ea52.firebaseio.com",
  storageBucket: "fir-test-5ea52.appspot.com",
  messagingSenderId: "1038984913127"
})
let anonUser = null;
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    if (user.isAnonymous) {
      anonUser = user;
      console.log('logged in anonymously', user, user.isAnonymous)
    }
    else {
      console.log('logged in', user, user.isAnonymous)
      if (anonUser) {
        anonUser.delete().then(() => {
          console.log("deleted anonymous user")
        }, error => {
          console.warning("failed to delete anonymous user", error)
        })
      }
    }
  }
  else {
    console.log('logged out - trying to log in anonymously')
    firebase.auth().signInAnonymously().then(res => {
      console.log("anonymous signin success", res, firebase.auth().currentUser)
    }, error => {
      console.warning("anonymous signin error", error)
    })
  }
})
const authUi = new firebaseui.auth.AuthUI(firebase.auth())

function clickLogout(e) {
  e.preventDefault()
  firebase.auth().signOut()
}
function SignedInView({user}) {
  return <div>
    <p>Hi {user.displayName || user.email}!</p>
    <a href="#" onClick={clickLogout}>Log out</a>
  </div>
}
class AnonymousView extends Component {
  componentDidMount() {
    authUi.start('.firebase-auth-container', {
      callbacks: {
        signInSuccess: (user, credential, redirectUrl) => {
          //console.log('from signinsuccess', firebase.auth().currentUser, user, credential, redirectUrl)
          // no redirect, let onAuthStateChange handle it
          return false
        }
      },
      credentialHelper: firebaseui.auth.CredentialHelper.NONE,
      signInFlow: 'popup',
      signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        //firebase.auth.GithubAuthProvider.PROVIDER_ID,
        {provider: firebase.auth.EmailAuthProvider.PROVIDER_ID, requireDisplayName: false},
      ],
    })
  }
  componentWillUnmount() {
    // timeout allows signinsuccess callback to run
    window.setTimeout(() => authUi.reset(), 0)
  }
  render() {
    return <div className='firebase-auth-container'></div>
  }
}
export default class AuthView extends Component {
  componentWillMount() {
    this.setState({user: null, loaded: false})
    this.unsubscribe = firebase.auth().onAuthStateChanged(user => this.setState({user, loaded: true}))
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  render() {
    if (!this.state.loaded) {
      return <div>loading auth...</div>
    }
    if (this.state.user && !this.state.user.isAnonymous) {
      return <SignedInView user={this.state.user} />
    }
    return <AnonymousView />
  }
}

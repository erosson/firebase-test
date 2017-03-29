import React from 'react'
import './Firebase'
import firebase from 'firebase'

function withState(WrappedComponent) {
  return class extends React.Component {
    componentWillMount() {
      this.setState({})

      this.unsub = firebase.auth().onAuthStateChanged(user => {
        let {dbref, state} = this.state
        if (dbref) {
          dbref.off('value')
        }
        if (user) {
          dbref = firebase.database().ref('users/'+user.uid+'/count')
          dbref.on('value', snapshot => {
            // just signed into an account (or received an update).
            // Resolve local-state vs. remote-state.
            if (snapshot && snapshot.val()) {
              // an existing account. Either just logged in, or updated from another device.
              // remote-state always wins, regardless of local state, if it exists.
              console.log('authstatechange-data: remote-nonempty,pull', state, snapshot.val())
              state = snapshot.val()
            }
            else if (state && state.loaded) {
              console.log('authstatechange-data: remote-empty,push', state)
              // no remote-state, yes local-state: new account just created.
              // persist local state
              //dbref.set({count: state.count})
            }
            else {
              // no local or remote state. Start a new game.
              state = {count: 0}
              console.log('authstatechange-data: local-empty,reset', state)
            }
            state.loaded = true
            this.setState({state})
          })
        }
        else {
          // signed out 
          state = {loaded: false}
          console.log('authstatechange-data:logout', state)
        }
        this.setState({dbref, state})
        console.log('update', state)
      })
    }
    componentWillUnmount() {
      this.unsub()
      let {dbref} = this.state
      if (dbref) {
        dbref.off('value')
      }
    }
    render() {
      let {dbref, state} = this.state
      console.log('redraw', state)
      return <WrappedComponent {...this.props} state={state} dbref={dbref} />
    }
  }
}

export default withState(function render({state, dbref}) {
  function push() {
    dbref.set({count: state.count})
  }
  function clickIncrement() {
    state.count += 1
    push()
  }
  function clickDouble() {
    state.count *= 2
    push()
  }
  function clickZero() {
    state.count = 0
    push()
  }

  if (!(state && state.loaded)) {
    return <p><b>...</b></p>
  }
  return <div>
    <p><b>{state.count}</b></p>
    <button onClick={clickIncrement}>++</button>
    <button onClick={clickDouble}>&times;2</button>
    <button onClick={clickZero}>0</button>
  </div>
})

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

// Start writing Firebase Functions
// https://firebase.google.com/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase! "+new Date());
})

exports.queuecountIncr = functions.https.onRequest((request, response) => {
  admin.database().ref('/queue').push('queuecountIncr')
  response.send("queued");
})
exports.queuecount = functions.https.onRequest((request, response) => {
  admin.database().ref('/secure/queuecount').once('value').then(snapshot => {
    response.send('count: '+snapshot.val());
  })
})

exports.userActionQueue = functions.database.ref('/queue').onWrite(event => {
  const ref = admin.database().ref('/secure/queuecount')
  return ref.transaction(current => (current || 0) + 1)
})

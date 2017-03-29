var fns = require('./index')
 
it('runs the fn tests', done => {
  const res = {
    send(msg) {
      expect(msg.indexOf("Hello")).toBeGreaterThanOrEqual(0)
      done()
    },
  }
  fns.helloWorld(null, res)
})

function runInParallel (Worker, input) {
  return new Promise(function (resolve, reject) {
    var worker = new Worker()
    worker.postMessage(input)
    worker.onmessage = function (event) {
      resolve(event.data)
    }
  })
}

module.exports = {
  runInParallel: runInParallel
}

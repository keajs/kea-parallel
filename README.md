# kea-parallel-loader

Run big operations in the background.

Use in combination with `kea-logic` and `redux-saga`

To init:

```
npm install --save-dev kea-parallel-loader worker-loader
```

```js
// ./parallel-worker.js
export function worker (input) {
  console.log('in worker', input)

  let output = 0

  // a very slow sum
  for (var i = 0; i < 100000 * 10000; i++) {
    output += 1
  }

  return { random: 'output', result: output }
}
```

```js
// in ./saga.js
import { runInParallel } from 'kea-logic'
import worker from 'worker!kea-parallel!./parallel-worker'

export default function * saga () {
  console.log('starting saga')

  const result = yield runInParallel(taskWorker, {a: 'b'})

  console.log(result)
}
```

This outputs:

```js
starting saga
in worker Object {a: "b"}
Object {random: "output", result: 1000000000}
```

...while the entire app remains responsive

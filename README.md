# kea-parallel

Run big operations in a separate thread using web workers.

Use in combination with `kea-parallel-loader`, `worker-loader` and possibly also `redux-saga`

To init:

```
npm install --save kea-parallel
npm install --save-dev kea-parallel-loader worker-loader
```

Then:

```js
// ./long-worker.js
export function worker (input) {
  console.log('In long worker', input)

  let output = 0

  // a very slow sum
  for (var i = 0; i < input.count; i++) {
    output += 1
  }

  return { status: 'done', result: output }
}
```

without `redux-saga`:

```js
// in ./index.js
import { runInParallel } from 'kea-parallel'
import longWorker from 'worker!kea-parallel!./long-worker'

const start = new Date().getTime()
runInParallel(longWorker, {count: 1000 * 1000 * 1000}).then(result => {
  const end = new Date().getTime()
  const time = end - start

  console.log(result)
  console.log(`Execution time: ${time / 1000} sec`)
})
```

with `redux-saga`:

```js
// in ./saga.js
import { runInParallel } from 'kea-parallel'
import longWorker from 'worker!kea-parallel!./long-worker'

export default function * saga () {
  console.log('Starting saga')
  const start = new Date().getTime()

  const result = yield runInParallel(longWorker, {count: 1000 * 1000 * 1000})

  const end = new Date().getTime()
  const time = end - start

  console.log(result)
  console.log(`Execution time: ${time / 1000} sec`)
}
```

This outputs:

```
Starting saga
In long worker Object {count: 1000000000}
Object {status: "done", result: 1000000000}
Execution time: 8.892 sec
```

Everything inside 'long-worker.js' will be run in a separate thread, making the entire app responsive despite the huge blocking `for` loop.

In case you choose to call all your background workers `*-worker.js`, feel free to add this to your webpack config, above the line with babel-loader:

```js
// webpack 2
{
  test: /\-worker\.js$/,
  exclude: /node_modules/,
  loaders: [
    'worker',
    'kea-parallel'
  ]
},

// webpack 1
{
  test: /\-worker\.js$/,
  exclude: /node_modules/,
  loaders: 'worker!kea-parallel'
},
```

## Caveats

Currently there is no thread pooling. Spawning a lot of workers is still untested.

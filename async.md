# Async JS

Previously we said that JS is:
1. Single threaded (everything happens in one thread)
2. Synchronous (the code is executed line by line as it was written)

So... What happens if we need to perform a heavy operation (which takes a long time) before we continue executing the code in the thread? 

Either we are running code in the Browser or Node, both runtimes has more than the JS Engine, they include (among others) extra functionality/features like APIs to execute code asynchronously.

Web APIs: https://developer.mozilla.org/en-US/docs/Web/API
For example, `setTimeout()`

```js
function firstOperation() {
  console.log(`Operation 1`);
}

setTimeout(firstOperation, 5000);

console.log(`Operation 2`);
```

Result:
```
Operation 2

Operation 1
```

What's going on?
When we execute `setTimeout(firstOperation, 5000);` we pass a reference to the function that we want to execute when our timer (in the browser) reaches 5000ms, so, in between, JS code can keep executing. 
Once the Browser/Node timer finishes, the reference to  `firstOperation` is going to end in the `callback queue`, then the `Event Loop` is going to move it to the `call stack` and finally it will be executed.

**Important: **

1. The reference is going to be de-queued and moved to the `call stack` **ONLY** when all synchronous code finished executing.

2. The Event Loop checks constantly if the `call stack` is empty and if there's `no more sync code to run`. If that's the case, it will de-queue from the `callback queue` and move to the `call stack`. If not, it will wait before de-queueing. 

## Callbacks

A callback is a function that will be called with the result when the operation is done.

Cross pattern example:
```js
function getUser(id, callback) {
  setTimeout(() => {
    callback({ id, username: 'Peter' });
  }, 3000);
}

getUser(10, (result) => console.log(result));
```

Output:
```
{ id: 10, username: 'Peter' }
```

### Callback hell

```js
function getUser(id, callback) {
  setTimeout(() => {
    callback({ id, username: 'Peter' });
  }, 3000);
}

function getHobbiesForUser(userId, callback) {
  setTimeout(() => {
      callback(['reading', 'writing']);
  }, 1000);
}

function getExpensesForHobby(hobby, callback) {
  setTimeout(() => {
      callback(10);
  }, 1000); 
}


// This is the callback hell
getUser(10, (user) => {
  console.log(user);
  getHobbiesForUser(user.id, (hobbies) => {
    console.log(hobbies);
    for (let hobby of hobbies) {
      getExpensesForHobby(hobby, (expenseForHobby) => {
        console.log(expenseForHobby);
      })
    }
  })
});
```

Output:
```
{ id: 10, username: 'Peter' }
[ 'reading', 'writing' ]
10
10
```

**Fixing Callback Hell with Named Functions**

```js
function getUser(id, callback) {
  setTimeout(() => {
    callback({ id, username: 'Peter' });
  }, 3000);
}

function getHobbiesForUser(userId, callback) {
  setTimeout(() => {
    callback(['reading', 'writing']);
  }, 1000);
}

function getExpensesForHobby(hobby, callback) {
  setTimeout(() => {
      callback(10);
  }, 1000); 
}

//

getUser(10, getHobbiesForUseSync);

function getHobbiesForUseSync(user) {
  console.log(user);
  getHobbiesForUser(user.id, getHobbiesAndExpensesSync);
}

function getHobbiesAndExpensesSync(hobbies) {
  console.log(hobbies);
  for (let hobby of hobbies) {
    getExpensesForHobby(hobby, logExpenseForHobby);
  }
}

function logExpenseForHobby(hobby) {
  console.log(hobby);
}
```

Output:
```
{ id: 10, username: 'Peter' }
[ 'reading', 'writing' ]
10
10
```

## Promises

<!--
With Promises we can track in JS what's happening outside JS, like when making network requests. When the work outside JS is done, the promise will return a value.
-->

A Promise is an object representing the eventual completion or failure of an asynchronous operation. 
More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises

**Resolving example:**

```js
const promise = new Promise(function(resolve, reject) {
  // async operations
  setTimeout(() => {
    resolve({ data: 'This is the data' });
    //reject(new Error('Something went wrong!'));
  }, 1000);
})

promise
  .then(result => console.log(result))
  .catch(err => console.log(err));
```

Output:
```
{ data: 'This is the data' }
```

**Rejecting example:**

```js
const promise = new Promise(function(resolve, reject) {
  // async operations
  setTimeout(() => {
    //resolve({ data: 'This is the data' });
    reject(new Error('Something went wrong!'));
  }, 1000);
})

promise
  .then(result => console.log(result))
  .catch(err => console.log(err));
```

Output:
```
Error: 'Something went wrong!'
```

**Promises states**
* Pending
* Fulfilled
* Rejected
* Settled


Cross pattern example:
```js
function getUser(id) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id, username: 'Peter' });
      }, 3000);
  });
}

function getHobbiesForUser(userId) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(['reading', 'writing']);
      }, 3000);
  });
}

function getExpensesForHobby(hobby) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(10);
      }, 3000);
  });
}

getUser(10)
  .then(user => {
    console.log(user);
    // here we return a new promise
    return getHobbiesForUser(user.id);
  })
  .then(hobbies => {
    console.log(hobbies);
  })
  .catch(err => console.log(err));
```

Output:
```
{ id: 10, username: 'Peter' }
[ 'reading', 'writing' ]
```


Fetch example:
```js
function parseAndLog(data) {
  console.log(data);
}

const result = fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(data => data.json())
  .then(parseAndLog)
  .catch(err => console.log(err));
```

Output: 

```
{
  userId: 1,
  id: 1,
  title: 'delectus aut autem',
  completed: false
}
```

### Promise.resolve() and Promise.reject()

**Promise.resolve(value)**
```js
// This returns a resolved Promise 
const user = Promise.resolve({ id: 10, username: 'Peter' });

user.then(u => console.log(u));
// { id: 10, username: 'Peter' }
```

**Promise.reject(errorObject)**
We use an Error object to include the callstack.

```js
const user = Promise.reject(new Error('Something went wrong!'));

user.catch(error => console.log(error));
```

### Promise.all(arrayOfPromises)

The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises.
This returned promise will resolve when all of the input's promises have resolved, or if the input iterable contains no promises. It rejects immediately upon any of the input promises rejecting or non-promises throwing an error, and will reject with this first rejection message / error.
More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 1000);
});

Promise.all([promise1, promise2])
  .then(values => {
  console.log(values);
  })
  .catch(err => console.log(err));
```

Output:
```
[ 1, 2 ]
```

### Promise.race()
The Promise.race() method returns a promise that fulfills or rejects as soon as one of the promises in an iterable fulfills or rejects, with the value or reason from that promise.
More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/race

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  }, 1000);
});

const promise2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(2);
  }, 1000);
});

Promise.race([promise1, promise2])
  .then(values => {
  console.log(values);
  })
  .catch(err => console.log(err));
```

Output:
```
1
```

## Async/Await
We write async code that looks like sync code

```js
function getUser(id) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ id, username: 'Peter' });
      }, 3000);
  });
}

function getHobbiesForUser(userId) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(['reading', 'writing']);
      }, 3000);
  });
}

function getExpensesForHobby(hobby) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(10);
      }, 3000);
  });
}

async function logUserHobbies() {
  const user = await getUser(10);
  const userHobbies = await getHobbiesForUser(user.id);
  console.log(userHobbies);
}

logUserHobbies();
```

Output:
```
[ 'reading', 'writing' ]
```
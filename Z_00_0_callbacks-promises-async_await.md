# Callbacks, Promises and Async/Await

## Async Callback
An async callback is a function that is passed into another function (as a parameter) and invoked once the first function resolves or completes.

In our example, we have the function `returnUserDataFromSourceX(userId, callback)` which receives 2 arguments: `userId` and the `callback`. I´m using `setTimeout()` to simulate the delay between "requesting and retrieving data from X source" (remember that this part is just an abstraction to focus on the callback´s side).
Our operation "takes 1 second" to complete. As soon as we have the data, the `callback is invoked with that information`, and, since we are passing the function `logUser(dataFromDb)` as callback, the result is: `Hello Peter`

```javascript
function returnUserDataFromSourceX(userId, callback) {
  // Do some ASYNC operation querying by userId
  // we will simulate the "delay" with setTimeOut()
  setTimeout(function() {
    callback({ name: 'Peter', age: 30 })
  }, 1000)
}

function logUser(dataFromDb) {
  console.log('Hello', dataFromDb.name);
}

returnUserDataFromSourceX(1234, logUser);

/*
returnUserDataFromSourceX(1234, function(dataFromDb){
  console.log('Hello', dataFromDb.name);
});
*/

```

## Promise
Promises are objects that holds the result of an async operation.
It has 3 stages:
Pending
Rejected
Fulfilled or Resolved

To consume the promise we use then() to get the result and catch() to get errors

```javascript
function returnUserDataFromSourceX(userId) {
  // Do some ASYNC operation querying by userId
  // we will simulate the "delay" with setTimeOut()
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ name: 'Peter', age: 30 })
    }, 2000)
  })
}

function logUser(dataFromDb) {
  console.log('Hello', dataFromDb.name);
}

const userFromDB = returnUserDataFromSourceX(1234);
userFromDB
.then(function(data) {
  logUser(data);
})
.catch(function(err) {
  console.log(err);
});

```

## Async and await

```javascript
async function returnUserDataFromSourceX(userId) {

 const result =  await new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ name: 'Peter', age: 30 })
    }, 2000)
  })

  return result;
}

let results = returnUserDataFromSourceX(1).then(function(response) {
  console.log(response);
});

```
# Closures

<!-- 
Everything related to closures
-->

They give us access to an outer function's scope from an inner function.

More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures


```js
function createFunction() {
  const num = 1;
  
  function increaseNumber(numberToIcrease) {
    return num + numberToIcrease;
  }
  
  return increaseNumber;
}

const cf = createFunction();

const increaseWith3 = cf(3);
console.log(increaseWith3); // 4
```
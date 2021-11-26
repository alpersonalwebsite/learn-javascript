# Scope
Determines the context on which a variable can be accessed.

This is constant is declared in the `global scope` and can be accessible everywhere.
```js
const name = 'Peter';

const logName = (name) => {
  console.log(name)
}

console.log(name); // Peter
logName(name); // Peter
```

This constant is declared in a `local or block scope` and can be accessible only inside `logName()`

```js
const logName = () => {
  const name = 'Peter';
  console.log(name)
}

logName(name); // Peter
console.log(name); // undefined
```

One gotcha, `local variables` take precedence over `global variables`.

```js
const name = 'Wendy';

const logName = () => {
  const name = 'Peter';
  console.log(name)
}

logName(); // Peter
```
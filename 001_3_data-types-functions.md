# Functions
Functions are objects

<!-- 
Everything related to a function
IIFE
-->


<!--
Functions are object functions combos

function hello() {
  console.log('Hello');
}

hello.sayHi = function() {
  console.log('Hi');
}

hello.someProperty = 'propertyValue';


console.log(hello)

hello();

hello.sayHi();

//
[Function: hello] { sayHi: [Function], someProperty: 'propertyValue' }
Hello
Hi
-->



## Function declaration

```js
function sayHi() {
  console.log('Hi');
}

sayHi(); // Hi
```

## Function expression

```js
const sayHi = function() {
  console.log('Hi');
}

sayHi(); // Hi
```

The **main difference** between `function declaration` and `function expression` is that `WE CAN` call the `function` defined with `function declaration` before its definition.

This is because JS engine moves all the `function declaration` to the top. This is called `hoisting`

```js
sayHi(); // Hi

function sayHi() {
  console.log('Hi');
}
```

Quick note:
1. If you use a name, like `const hi = function sayHi() {}` it is a named function expression.
2. If not, like `const hi = function() {}` it is an anonymous function expression.


The less parameters a function has, the better. So we should have default values in our functions.

```js
function Person(name, age) {
  this.name = name;
  this.age = age;

  // these are default properties hen we are creating the Person object
  this.friends = [];
  this.hobbies = [];
  this.isAlive = true;
}

const peter = new Person('Peter', 30);

console.log(peter);

// Person {
//   name: 'Peter',
//   age: 30,
//   friends: [],
//   hobbies: [],
//   isAlive: true,
//   __proto__: { constructor: ƒ Person() }
// }
```



## TODO: Add call, apply and bind

## Function and default values

```js
function sayHi(name = 'user') {
  console.log(`Hi ${name}`);
}

sayHi();
sayHi('Peter');

// 'Hi user'
// 'Hi Peter'
```

## Functions and arguments
We can have functions with a varying number of parameters...

1. Using the rest operator (`parameter1, parameter2, ...args`)
We will be looping through the args array.

```js
function printNames(...args) {
  for (let element of args) {
    console.log(element)
  }
}

printNames('Peter', 'Paul', 'Lora');
// 'Peter'
// 'Paul'
// 'Lora'
```

2. Accessing the `argument` object.

```js
function printNames() {
  console.log(arguments);
}

printNames('Peter', 'Paul', 'Lora');

// {
//   '0': 'Peter',
//   '1': 'Paul',
//   '2': 'Lora',
//   length: 3,
//   callee: ƒ printNames(),
//   __proto__: {
//     // ...
//   }
// }
```

Loop through the `arguments` keys:

```js
function printNames() {
  for (let key in arguments) {
    console.log(arguments[key])
  }
}

printNames('Peter', 'Paul', 'Lora');
// 'Peter'
// 'Paul'
// 'Lora'
```

Remember the difference between `parameters` and `arguments`

In the example...
1. color is a parameter of the function printColor()
2. black is an argument

```js
function printColor(color) {
  console.log(color);
}

printColor('black');
```

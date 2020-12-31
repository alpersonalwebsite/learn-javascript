# ES6 or ES2015

<!-- 
TODO: New things. Quick check. 
-->


<!-- **Declaring variables with let and const**

* For variables that never change use `const` (abbr. *constant*)
* For the rest, use `let`

*Note*: There is a general consensus to avoid `var`. Personally, I think `var` has its own intrinsic value as we will see. Yet, if you are working in a new project (aka, post es2015) or with other developers, my advice is to use `let` as a well-accepted convention.


What's the "main" difference between `let` and `var`...?
`Let` is block scoped while `var` is hoisted, which means that all the declarations are going to be "lifted to" the top of the scope, either a function or the global scope. 

Clear enough...? Maybe not! 
This is an example of how JS hoist variables declared with `var`

```js
name = 'peter';

var name;

console.log(name);
```

What is going on...? When the interpreter finds the code...

1. Creates in the global memory a namespace with the value `name`
2. Assigns `peter` as the value of `name`
3. Looks for the method `.log()` in the object `console`
4. Creates a new `execution context`
5. Creates in the local memory of the execution context a namespace with the value `name`
6. Assigns `peter` as the value of `name`
7. Logs into the console

Yes... All that and more! :)

But the important thing (at least for the moment), is how JS allows you to declare your variable after you initialize it ("just to take care of it later")

Now, if you try the same example replacing `var` with `let` you will receive the following error: `ReferenceError: Cannot access 'name' before initialization`

You have a basic understanding of `hosting`, however, you could be asking yourself... What about `global/function scope` vs. `block scope`.

Example: global and function scope

```js
var globalVariable = 1;

function someFunction() {
  for (var localVariable = 0; localVariable < 5; localVariable++) {
    // some logic
  }
  console.log(`localVariable value is ${localVariable}`);
}

someFunction();

console.log(`globalVariable value is ${globalVariable}`);
```

Output:

```
localVariable value is 5
globalVariable value is 1
```

/////// Hasta aca -->



<!--
You can see the difference in the following example:

```javascript
function someFunction() {
  for (var varVariable = 0; varVariable < 5; varVariable++) {
    // some logic
  }
  console.log('var is ' + varVariable)


  for (let letVariable = 0; letVariable < 5; letVariable++) {
    // some logic
  }
  console.log('let is ' + letVariable)
  
}

someFunction();
```

Output:
```
var is 5
ReferenceError: letVariable is not defined
```

We can access to `varVariable` outside the for statement/block, however, we cannot do the same with `letVariable`. 

---

-->

## let and const
<!-- Even when I'm addressing this in the intro, maybe I should move it here or add something here -->

## Template literals
(Also called in early stages "template strings")

Template literals are string literals allowing embedded expressions. 
You can use multi-line strings and string interpolation features with them.
[Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)

Before, `template literals` we concatenate strings using the `+` operator or the `concat()` string method.

```js
const str1 = 'Hello';
const str2 = 'Peter';

const result1 = str1 + ' ' + str2;

const result2 = str1.concat(' ', str2);


console.log(result1);
console.log(result2);

// Hello Peter
// Hello Peter
```

Things were even more verbose when we wanted to have multi-lines strings.

```js
const str1 = 'Hello';
const str2 = 'Peter';

const result1 = str1 + '\n' + str2;

console.log(result1)
// Hello
// Peter
```

Now, with `template literals` we can easily do string interpolations using the backticks ``. 

```js
const str1 = 'Hello';
const str2 = 'Peter';

const result = `${str1}, 
my name is 
${str2}`;

console.log(result);

// Hello, 
// my name is 
// Peter
```

Technically, you can do more than referencing a variable inside these `embedded expressions`, however, it is a good advise to abstract the logic to a function and invoke it.

```js
const str1 = 'Hello';
const str2 = 'Peter';

const isPeter = (name) => {
  if (name.toLowerCase() === 'peter') {
    return `If you want more information about ${name}...`
  }
  return `Keep searching!`
}


const result = `${str1}.
Are you lokking for ${str2}?
${isPeter(str2)}`;

console.log(result);

// Hello.
// Are you lokking for Peter?
// If you want more information about Peter...
```

## Destructuring assignment

The destructuring assignment syntax is a JavaScript expression that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.
[Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)

```js
const arr = [0, 1, 2, 3, 4, 5, 6];

const [a, b, c, ...rest] = arr;

console.log(`${a}
${b}
${c}
${rest}`)

// 0
// 1
// 2
// 3,4,5,6
```

## Arrow function

*MDN Web Developer* defines it as "a syntactically compact alternative to a regular function expression, although without its own bindings to the this, arguments, super, or new.target keywords. Arrow function expressions are ill suited as methods, and they cannot be used as constructors".
[Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)


*Before es2015:* function example

```javascript
function add(num1, num2) {
  return 'The results of this operation is ' + (num1 + num2);
}

add(2,3);
```

*With es2015:* function example

```javascript
const add = (num1, num2) => {
  return `The results of this operation is ${num1 + num2}`
}

add(2,3);
```
In both cases the output will be `The results of this operation is 5`

This is a "quick and dirty example". In a real world application (functional and pure programming), you -probably- will have...
1. `add(number, number, nameSpace = 'string')` receiving an extra argument for the message. In this case, you could also set a parameter with a default value, so, if you don´t explicitly pass it, it will use the pre-set one.

```javascript
const add = (num1, num2, message = 'The results of this operation is') => `${message} ${num1 + num2}`;
console.log(`${add(2,3, 'The sum is:')}`)
```

2. **Preferred approach:** `add()` will just do what´s supposed to do... ADD! This pattern is "one function per need". `add()` will sum and return while other variable will hold the message. 

```javascript
const add = (num1, num2) => num1 + num2;
const message = 'The results of this operation is';

console.log(`${message} ${add(2,3)}`)
```

*Note:* We could also create a new function, `showMessage('string', fn)`, pass the function `add()` as argument and log to the console the message (including add() return) from that function. However, this is extremely granular unless there´s a real possibility of reusability. 

**Remember:** in arrow functions there´s no `this keyword`.

Example: `this`  inside arrow function and regular function methods.
```javascript
const someObj = {
  someProperty: 1,
  someMethodArrowFn: () => {
    console.log(this.someProperty, this)
  },
  someMethodwFn: function() {
    console.log(this.someProperty, this)
  }
}

someObj.someMethodArrowFn();
someObj.someMethodwFn();
```

Result:

```
undefined - global or window

1 { someProperty: 1,
  someMethodArrowFn: [Function: someMethodArrowFn],
  someMethodwFn: [Function: someMethodwFn] }
```

**Remember:** arrow functions cannot be used as constructor functions

Example: invalid constructor
```javascript
const Person = name => {
  this.name = name;
}

const person1 = new Person('Peter');

console.log(person1);
```

Result: 
```
TypeError: Person is not a constructor
```

**Remember:** arrow functions don´t have prototype.

```javascript
const Person = () => {
}

const Human = function() {
}

console.log(Person.prototype);
console.log(Human.prototype);
```
Output:
```
undefined // using arrow function
Human {} // using regular function expression
```

---

## Classes
We can see Classes as the blueprints of the objects created through these "special functions".
In our first example, `Friend` (type: function) is the blueprint of `friend1` (type: object).

Classes can be defined in 2 ways as we normally do it with our "regular functions" (remember they are *just* "special functions"):

* Class expression
```
class Friend {
  ...
}
```

* Class declaration
```
const Friend = class  {
  ...
}
```

Example: class expression
```javascript
class Friend {
  constructor(name) {
    this.name = name;
  }
  sayHi = () => {
    return `Hi ${this.name}`;
  }
}


const friend1 = new Friend('Peter');
console.log(friend1.sayHi());
```

Result:
```
'Hi Peter'
```





JavaScript’s object system is based on prototypes, not classes.







Notes:
 The `constructor() method` will be executed when we instantiate the class with the `new keyword`.



Instances are typically instantiated via constructor functions with the `new` keyword.

We instantiate the class with the new keyword
He refers to constructor functions ????

// We can inherit properties and methods   class Person extends Master
He refers to prototypes ????

Constructor iss a default function method that will be executed whenever we instantiate the class

Classes are constructor functions and inheritance prototypes...



---

TO ADD: this keyword issue and arrow function solution

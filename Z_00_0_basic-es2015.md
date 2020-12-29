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

**Arrow function**

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

**Classes**
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

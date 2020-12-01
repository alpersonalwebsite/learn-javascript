# OOP with JS

<!--
TODO: Intro
-->

## Creating or initializing objects

There are several ways to create or initialize an object.

### Literal notation

```js
const myObj = {
  name: 'Peter'
};

console.log(myObj);
// { name: 'Peter' }
```

We can use `literal notation` to initialize an object and the `dot notation` to add properties.

```js
// literal notation
const myObj = {};

// dot notation
myObj.name = 'Peter';

console.log(myObj);
// { name: 'Peter' }
```


### Object() constructor

```js
const myObj = new Object();

myObj.name = 'Peter';

console.log(myObj);
// { name: 'Peter' }
```

### Object.create()
We pass an existing object as the prototype of the new object **or** `null`

```js
const myObj = {};
myObj.name = 'Peter';

const mySubObj = Object.create(myObj);

console.log(mySubObj);
// {}

console.log(mySubObj.name);
// Peter
```

... and we can check if `myObj` is the prototype of `mySubObj`

```js
console.log(Object.getPrototypeOf(mySubObj) === myObj)
// true
```

*Note:* Later we will see what prototype means. 

*Literal notation* is faster and less verbose and it should be your first option.

---

Now, let's say that you need to create several objects with "the same shape" or properties. 

You could do...
```js
const peter = {
  name: 'Peter',
  greeting() {
    console.log(`Hello, I'm ${this.name}`)
  }
}

const wendy = {
  name: 'Wendy',
  greeting() {
    console.log(`Hello, I'm ${this.name}`)
  }
}

const tinkerbell = {
  name: 'Tinkerbell',
  greeting() {
    console.log(`Hello, I'm ${this.name}`)
  }
}

console.log(peter);
// { name: 'Peter', greeting: [Function: greeting] }

peter.greeting();
// Hello, I'm Peter
```

... or, use a `regular function` to construct your objects.

```js
function createCharacter(name) {
  const newCharacter = {};
  newCharacter.name = name;
  newCharacter.greeting = function greeting() {
    console.log(`Hello, I'm ${this.name}`);
  }
  return newCharacter;
}

const peter = createCharacter('Peter');

const wendy = createCharacter('Wendy');

const tinkerbell = createCharacter('Tinkerbell');

console.log(peter);
// { name: 'Peter', greeting: [Function: greeting] }

peter.greeting();
// Hello, I'm Peter
```



#### Notes:
1. In `es2015` implementations you will see `greeting: function greeting() {}` instead of `greeting() {}`. Check the transpiled code into `es2015` in [babel](https://babeljs.io/repl#?browsers=defaults%2C%20not%20ie%2011%2C%20not%20ie_mob%2011&build=&builtIns=false&spec=false&loose=false&code_lz=MYewdgzgLgBADgUyggTjAvDA3gKBjMAQwFsEAuGAcgAUlVKAaPGAcxQSQEswWAKASmzN8oSCAA2CAHTiQfAAYAJBONkMYASUrEYAEixQAFpwhSipAL7z-zCzgtA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=env%2Ces2015&prettier=false&targets=&version=7.12.9&externalPlugins=)


<!-- Until here -->

**Sample object**

```js
const character = {
  name: 'Peter',
  lastName: 'Pan',
  greeting: (yourName) => `Hello, ${yourName}`
}

console.log(
  character.greeting('Wendy')
)
```

**Quick note about THIS:**

We are going to address `this` keyword in other section. But for the moment, and to keep the sight in `OOP`, just remember... *Arrow functions close over `this` of the lexically enclosing context.*
So, if you need to access to a property of your object, use regular functions.

Examples:

The context of our arrow function is the Global/Window object; the context of our "regular" function is the base object.

```js
const name = 'Global-Peter'

const character = {
  name: 'Scoped-Peter',
  arrowGreeting: () => {
    return `My name is ${name}`
  },
  funcGreeting() {
    return `My name is ${this.name}`
  }
}

console.log(
  character.arrowGreeting(),
  character.funcGreeting()
)

```

## Adding properties

```js
const myObj = {}

myObj.someProperty = 123

myObj['property with special chars'] = 'abc'

myObj.someMethod = function() {
  return 'Hi!'
}

console.log(myObj.someProperty)
// 123

console.log(myObj['property with special chars'])
// abc

console.log(myObj.someMethod())
// Hi!
```

A few notes before jumping to the next topic:

1. You can take advantage of named function to improve your debugging work (instead of anonymous functions). Here will not have much sense, but when you are going through stack traces it could make thing clearer and easier to understand or debug.
```js
myObj.someMethod = function theFunctionName() {
  return 'Hi!'
}
```

2. Feel free to use **ES2015**
```js
myObj.someMethod = () => {
  return 'Hi!'
}
```

3. Since we are just returning, if you want to have a "cleaner" code you can do:
```js
myObj.someMethod = () => 'Hi!'
```

## Removing properties

```js
const myObj = {}

myObj.someProperty = 123

delete myObj.someProperty

console.log(myObj)
```

Both previous methods to `ADD` and `DELETE` properties mutate the `object`. 

In **JavaScript** we have `primitive` (string, number, boolean, etc) and `reference types` (objects and its special object type, array)

**Primitives are immutable while reference types are mutable.**

Let's see some examples to illustrate the previous statements. They will also help us to start taking `scopes` into consideration.

1. `var` holding a `primitive` value and a `function updating` (or mutating) the value of that variable

```js
var primitive = 123

function updt(n) {
  primitive = n
}

updt(1)

console.log(primitive)
// 1

console.log(window.primitive)
// 1
```

Some considerations...
When we use `var`, the scope is going to be global/window or the function within its declared.
If we add the `var statement` inside the function we will have a totally different result, since now, we have 2 primitive variables, one scoped to the global object (in the browser, `window`) and the other to the function `updt`

```js
var primitive = 123

function updt(n) {
  var primitive = n
  return n
}

updt(1)

console.log(window.primitive)
// 123

console.log(updt(1))
// 1
```

Remember, since our variable is scoped to the `updt function`, every other `function` within this one will have access to it.

```js
var primitive = 123

function updt(n) {
  var primitive = n
  return function insideUpdt() {
    return primitive
  }()
}

updt(1)

console.log(console.log(updt(1)))
```

*Note*: Here we are returning what the invocation of `insideUpdt()` returns, that's why we have the extra `()`. And yes, we could totally avoid naming our function (aka, use an anonymous function) but, for debugging purposes, named function always help.

2. `var` holding a `primitive` value and an `if statement` re-declaring that variable and assigning a new value

```js
var primitive = 123

// same as if(true)
if(1) {
  var primitive = 456
}

console.log(primitive)
// 456
```

Remember `var` is **NOT scoped** at the `block-level`.
We are re-declaring our `primitive` variable (doable with `var`) and assigning a new value.
BTW, remember that JS is going to process variable declarations before execution (aka, `hoisting`). So, the engine will do the following:

```
var primitive = 123
primitive = 456
```

Now... What happens if we replace the `var` key with `let`...? 

```js
let primitive = 123

// same as if(true)
if(1) {
  let primitive = 456
}

console.log(primitive)
// 123
```

As you probably guessed, for everything inside the "`if` scope" the value of `primitive` is going to be `456`. For the rest, it will be `123`. We are going to obtain "similar" results with `const`, with the difference that once declared and assigned the value, we won't be able to mutate it. 

```js
if(1) {
  const primitive = 456
  primitive = 789
  console.log(primitive)
}
```

Result: `TypeError: Assignment to constant variable.`

One more thing to remember... Global constants (`let` and `const`) do not become properties of the window object, unlike var variables.

```js
var global = 1
let notGlobal0 = 2
const notGlobal1 = 3

console.log(
  `
  ${window.global}
  ${window.notGlobal0}
  ${window.notGlobal1}
  `
)
```

Result:

```js
  1
  undefined
  undefined
```

3. `const` holding a `reference type` value and a `function updating` (or mutating) the data source (original variable)

```js
const referenceValue = [1,2,3]

function addNumberToArray(arr, num) {
  arr.push(num)
  return arr
}

console.log(addNumberToArray(referenceValue, 4))
// [ 1, 2, 3, 4 ]

console.log(referenceValue)
// [ 1, 2, 3, 4 ]
```

We have seen `mutations` (and immutability patterns) in several sections. But, it never hurts to refresh the memory.

Look at the snippet above...? Is the return of `addNumberToArray()` what you were expecting...?
If not, let's make a quick go-through.

We declared a `constant` holding an `array` (of numbers) as value.
We declared a `function` which receives as arguments an `array` and a `number`. This function pushes the number as an item into the passed array (aka, it adds the item to the end of the array); then, it returns its value.

However... When we are logging both, the return of our function and our original constant, we can see that both are returning the "same value".

*First feeling:* Didn't we say we cannot reassign the value of a `constant`?
Yes... Technically, we are not changing its value if not altering one of its properties (same for item's arrays)

This **reassigns the values** and produces the expected ERROR

```js
const numbers = [1,2,3]
numbers = [1,2,3,4]

const names = {
  dad: 'Peter',
  son: 'Pan'
}

names = {
  dad: 'Peter',
  son: 'Pan',
  sister: 'Wendy'
}
```

Result: `TypeError: Assignment to constant variable.`

Now, this doesn't reassign. It just update the property/list.

```js
const numbers = [1,2,3]
numbers.push(4)

const names = {
  dad: 'Peter',
  son: 'Pan'
}

names.sister = 'Wendy'


console.log(numbers)
// [ 1, 2, 3, 4 ]

console.log(names)
// { dad: 'Peter', son: 'Pan', sister: 'Wendy' }
```

From Mozilla's docs...
> The const declaration creates a read-only reference to a value. It does not mean the value it holds is immutable—just that the variable identifier cannot be reassigned. For instance, in the case where the content is an object, this means the object's contents (e.g., its properties) can be altered.


*Second feeling:* Why did the original constant change...?

Maybe you tried to declare a variable within the function, assigned as its value the `array` we are passing and then, performed the operation...

```js
function addNumberToArray(arr, num) {
  const newReferenceValue = arr
  newReferenceValue.push(num)
  return newReferenceValue
}
```

Yet, the output is still the same.

And this is because we are dealing with `reference types`. 
Objects (and arrays) are reference types... This means that every time we perform an operation over the reference, we are actually affecting the original object itself.

*Time to see some basic examples:*

Here we are declaring a constant with an object as value. That object is created using `literal notation`
Then, we declare a new constant which points to the previous one.
That why when we compare both, the result is **true**: they refer to the same object.

```js
const character = {
  name: 'Peter',
  latName: 'Pan'
}

const refToObj = character

console.log(refToObj)
console.log(character)

// { name: 'Peter', latName: 'Pan' }
// { name: 'Peter', latName: 'Pan' }

console.log(character === refToObj)
// true 
```

Here we have 2 objects *with the same keys and values*.
When we compare both, the result is **false**

```js
const peter1 = {
  name: 'Peter',
  latName: 'Pan'
}

const peter2 = {
  name: 'Peter',
  latName: 'Pan'
}

console.log(peter1)
console.log(peter2)

// { name: 'Peter', latName: 'Pan' }
// { name: 'Peter', latName: 'Pan' }

console.log(peter1 === peter2)
// false 
```

This is because comparisons between objects is by `reference` (not value), and, as you can see, each constant (object) refers to itself.  

**DO NOT do the following. Take it just as an illustration**

What happens if we convert into strings both object before comparing them...

```js
console.log(JSON.stringify(peter1) === JSON.stringify(peter2))
// true 
```

... since string comparisons are by `value`, both strings are equal.

---


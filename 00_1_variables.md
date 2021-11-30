# Variables
Variables store data in the computer's memory (this is a temporal storage).

There are some constraints at the time of naming variables. 

1. You cannot use `reserved keywords`, like `new`.
2. They should start with a letter.
3. The only symbol supported is `_`.
4. They are case sensitive. `age` and `Age` are totally different variables.

Something important to consider is given them an appropriate name. There's no "how to" for this, just try to describe its value from "general" to "particular". 




We have 3 keywords to declare a variable in JS: `var`, `let` and `const`
The main difference between `var` and `let/const` (ES2015) is that `var` is **function-scoped** (hoisted) and `let/const` are **block-scoped**.
We should use const for values that should not change (constants).

**Quick tip: AVOID using var**

`var` summary:
1. Inside of a function, it will be hoisted to the top of the function.
2. Outside of a function, it will be attached to the `global` context (for example, `window.yourVarName`)

> The main difference between `let` and `const` is that `let` allows us to reassign its value, while `const` persist its initial assignation. For variables that will not change the values they hold, you should use `const`.

Let's jump to a quick example to see this in action.

```js
function hoistingExample(name) {
  if (name) {
    var x = name;
    let y = name; 
  }
  console.log(`With var x is ${x}`)
  console.log(`With let y is ${y}`)
}

hoistingExample('Peter');
```

Result:
```
With var x is Peter
ReferenceError: y is not defined
```

**What's going on...?**
The variable declared with the `var` keyword is hoisted, or, raised to the top of the scope (in this case, the function). Remember: `const` and `let` are `block-scoped`.

So, under the hood, this is what the interpreter is doing...

```js
function hoistingExample(name) {
  var x;  
  if (name) {
    x = name;
    let y = name; 
  }
  console.log(`With var x is ${x}`)
  console.log(`With let y is ${y}`)
}

hoistingExample('Peter');
```

... and, it is what is going to be executed at runtime. 

But, what happens if we don't pass any argument.

```js
hoistingExample();
```

Result:

```
With var x is undefined
ReferenceError: y is not defined
```

As you can see, the value of `x` will be `undefined`. 
Why? Well, the interpreter is going to host the variable declaration to the top of the scope, but, since its value is assigned inside the if statement and we are not meeting the if condition... Te value of `x` will resolve to `undefined`.


We stated that `let/const` are block scoped, or "colloquially" tied to the curly braces `{}`

<!--
hen the variable is stuck in what is known as the temporal dead zone until the variable’s declaration is processed. This behavior prevents variables from being accessed only until after they’ve been declared.
 -->

This nested if example could make things clearer...
We are declaring `x` in a 3 levels nested block, however, we have access at the top of the function. So, in each if (or block), we have access to `x` too.

```js
function hoistingExample(name) {
  if (true) {
    if (true) {
      if (true) {
        var x = name;
      }
    }
  }
  console.log(name);
}

hoistingExample('Peter'); // Peter
```

**var and global scope**

```js
var name1 = 'Peter';
let name2 = 'Paul';

window.name1; // Peter
window.name2; // undefined
```
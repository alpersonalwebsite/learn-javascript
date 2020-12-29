# JavaScript

<!--
It should include...
Presentation
What is JS
History
Specification: https://javascript.info/manuals-specifications
Browser support: http://caniuse.com/
scrip tag
What's a statement
strict mode

-->



We have 3 keywords to declare a variable in JS: `var`, `let` and `const`
The main difference between `var` and `let/const` (ES2015) is that `var` is function scoped (hoisted) and `let/const` are block scoped.

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
The variable declared with the `var` keyword is hoisted, or, raised to the top of the scope (in this case, the function or local scope; however, outside the function, it will be the global scope).

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



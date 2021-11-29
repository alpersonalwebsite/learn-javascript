# JavaScript

<!--
It should include...
Presentation
What is JS
History
Specification: https://javascript.info/manuals-specifications

Difference between JS and ECMAscript
ECMAScfript is the specification
JS the programming language that confirms that specification

Browser support: http://caniuse.com/

script tag. We can place it in the headerf or before closing the body. It is best practice before closing body, so we let the browser parse the markup first (without blocking the rendering with parsing and executing JS) and have everything before we start interacting with the DOM

What's a statement
strict mode

-->


JavaScript is a dynamic language. This means that we can change the type of the values that our variable are holding anytime.
The type of the values in Dynamic languages is set at runtime in relation to the value.

```js
let name = 'Peter';
name = 2;
console.log(name); // 2
```

In static languages like JAVA, when we declare a variable we also assign its type. This prevents us to change the type of the value in the future.
The type of the values in Static languages is set at compilation time.

```java
String [] words  = {"Hi", "Hello"};
words = 1;
```

In this example, we are declaring the variable `words`, assigning as its type `an array of strings` and setting `{"Hi", "Hello"}` as its value.
Then, we are trying to set `1` (which is an integer), resulting in the following error:
```
error: incompatible types: int cannot be converted to String[]
```
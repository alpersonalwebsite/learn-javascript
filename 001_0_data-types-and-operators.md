# Data Types and Operators

## Data Types

### Primitives or value types

**Important**:
We have `primitives` and `Primitives Objects` like String.

```js
const stringLiteral = 'string literal';

const stringObjConst = new String('string object constructor');

console.log(typeof stringLiteral); // string
console.log(typeof stringObjConst); // object
```

JS wraps all primitives with their primitive objects so we can have access to methods defined in the constructor function. 

* null (used when we want to indicate the absence of value. For example, if the user didn't provide his favorite hobby)
* undefined
* boolean
* number (all numbers are just numbers, we don't distinguish between int, float, long, like in other languages)
* string
* symbol (ES2015)

<!-- TODO: Add examples. -->

If we don't initialize it, the default value and type of the variables will be `undefined`.

```js
let name;

console.log(name) // undefined
console.log(typeof name); // undefined
```

This values are immutable. 
For example, when we split a string we are not mutating the string in place, we are creating a new string.

### Reference types

* object
* function
* array (in JavaScript dynamic, we don't set a length and a type like in other languages. Its type is object)

**The main difference between primitives and reference types** is how the value is stored

In `primitives`, the variable holds the value (copied by value).
```js
let person1 = 'Peter';

// Here we copy the value of person1 tyo person2
let person2 = person1;

person1 = 'Wendy';

console.log(person1, person2);
// Wendy Peter
```

In `references`, the variable holds a reference to the address (in memory) where the value is stored (copied by reference).

```js
let person1 = { name: 'Peter' };
let person2 = person1;

person1.name = 'Wendy';

console.log(person1, person2);
// { name: 'Wendy' } { name: 'Wendy' }
```

---

## Operators

* Arithmetic: `+`, `-`, `*`, `**`, `/`, `%` and increment (`++`) and decrement (`--`)
* Assignment: `const name = 'Peter';` and shorthands like `num += 3`
* Comparison: equality `==`, `===`, `!=`, `!==`  and relational `>`, `>=`, `<`, `<=`
* Equality: `==` and `===`
* Ternary: `condition ? if-true-value : if-false-value;`
* Logical: `AND (&&)`, `OR (||)`, `not (!)`
* Bitwise: `|` and `&`

**Difference between** `strict equality`(===) and `lose equality` (==)

1. Strict equality: **same type and value**
2. Lose Equality: same value. It cast the left side value into the data type of the right side value. So, if we have...
  * 6 == '6' it will convert '6' into 6 and compare
  * 1 == true will convert 1 to true and compare

**Note about** `not (!)`

It will convert the value me pass into the opposite:

```js
const name = !'Peter'; // false
const num = !30; // false
const bool = !false; // true
const bool1 = !true; // false
```

**Falsy values**

* 0
* ''
* false
* undefined
* NaN
* null

Everything else is **truthy**

**Short-circuiting**

When we are using `OR`, when we find a truthy operand it returns that operand (the remaining operands are omitted)

```js
console.log(false || 1 || 2 || 3); // 1
```
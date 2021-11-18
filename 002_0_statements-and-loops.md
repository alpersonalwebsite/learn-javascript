# Loops and conditional statements

<!--
It should include...
Check if the name is good
include
switch
if/else
for
while
-->

## Conditional statements

### if... else

```js
if (condition) {
  // ...
} else if (anotherCondition) {
  // ...
} else {
  // ...
}
```

### switch... case

```js
switch (somethingToCompare) {
  case 'againstSomething': 
    // ...
    break;

  case 'againstAnotherSomething':
    // ...
    break;

  default:
    // ...
}
```

## Loops

Remember to have always an exit condition to avoid entering into an `infinite loop`

### while

```js
while (condition) {
  // ...
}
```

Example:

```js
let i = 1;

while (i < 4) {
  console.log(i);
  i++;
}

// 1
// 2
// 3
```

### do... while
First executes and then evaluates condition. So, the statement is executed at least once.

```js
do {
  // ...
} while (condition);
```

### for

```js
for (initialExpression; condition; incrementOrDecrement) {
  // ...
}
```

Example:

```js
for (let i = 1; i < 4; i++) {
  console.log(i)
}

// 1
// 2
// 3
```

### for... in
In `arrays` it will return each index as string
In `objects` it will return the object keys

```js
const arr = ['Hi','Hello','Hola']

for (let el in arr) {
  console.log(el);
}

// '0'
// '1'
// '2'

const obj = {
  prop1: 1,
  prop2: 2,
  prop3: 3
}

for (let prop in obj) {
  console.log(prop);
}

// 'prop1'
// 'prop2'
// 'prop3'
```

### for... of

```js
const arr = ['Hi','Hello','Hola']

for (let el of arr) {
  console.log(el);
}

// 'Hi'
// 'Hello'
// 'Hola'
```
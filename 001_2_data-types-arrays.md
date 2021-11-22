# Arrays

```js
const letters = ['a', 'b', 'c'];
```

## Truncate array

```js
let letters = ['a', 'b', 'c'];
let myLetters = letters;

letters.length = 0;
console.log(letters); // []
console.log(myLetters); // []
```

**Why don't we assign an empty array as value?**
Remember that objects are stored by reference.
So in the following example this is what's going to happen:

1. We create a new variable `letters` that will hold a reference to the memory address where we are storing the array `['a', 'b', 'c']`
2. We create a new variable `myLetters` and assign as its value the reference to the memory address where we are storing the array `['a', 'b', 'c']`.
3. We change the reference of `letters` since now it will point to a different location in memory where the empty array will be stored `[]`
4. The `myLetters` reference that points to the memory location where we stored `['a', 'b', 'c']` remains intact.

```js
let letters = ['a', 'b', 'c'];
let myLetters = letters;

letters = [];

console.log(letters); // []
console.log(myLetters); // [ 'a', 'b', 'c' ]

```

## Adding elements to an array

### At the beginning: [O, x, x]

```js
const letters = ['a', 'b', 'c'];

letters.unshift('z');
console.log(letters); // [ 'z', 'a', 'b', 'c' ]
```

### At a particular position: [x, x, O, x]

`Array.splice(start, deleteCount, item1, item2, itemN)`

```js
const letters = ['a', 'b', 'c'];

letters.splice(1, 0, 'before b');
console.log(letters); // [ 'a', 'before b', 'b', 'c' ]
```

### At the end: [x, x, O]

```js
const letters = ['a', 'b', 'c'];

letters.push('d');
console.log(letters); // [ 'a', 'b', 'c', 'd' ]
```

## Removing elements from an array

### At the beginning: [O, x, x]

```js
const letters = ['a', 'b', 'c'];

letters.shift();
console.log(letters); // [ 'b', 'c' ]
```

### At a particular position: [x, x, O, x]

`Array.splice(start, deleteCount)`

```js
const letters = ['a', 'b', 'c'];

letters.splice(1, 2);
console.log(letters); // [ 'a' ]
```

### At the end: [x, x, O]

```js
const letters = ['a', 'b', 'c'];

letters.pop();
console.log(letters); // [ 'a', 'b' ]
```

## Looking for an element

* If you are dealing with a `value type` use `Array.includes()`
* If you are dealing with a `reference type` use `Array.find()`

**Array.includes(element, startingIndex)**
It returns true or false.

```js
const letters = ['a', 'b', 'c'];

letters.includes('b'); // true
```

**Array.indexOf(element, startingIndex)**
It returns the index of the element or -1 if the element doesn't exists in the array.

```js
const letters = ['a', 'b', 'c'];

letters.indexOf('b'); // 1
```

*Note:* If you want to find the last index of an element use `Array.lastIndexOf(element, startingIndex)`. Like in the case of:

```js
const letters = ['a', 'b', 'a'];

letters.lastIndexOf('a'); // 2
```

**Array.find(cb)**
It takes a callback and it returns the first match or undefined

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Paul', age: 20 },
  { name: 'Paul', age: 10 }
];

const paul1 = people.find(person => person.name === 'Paul'); 

console.log(paul1);
// { name: 'Paul', age: 20 }
```

## Sorting array

```js
const letters = ['c', 'a', 'b'];
letters.sort();

console.log(letters); // [ 'a', 'b', 'c' ]
```

### Sorting an array of number ASC

```js
const letters = [1,5,2];
letters.sort((a, b) => a - b);

console.log(letters); // [ 1, 2, 5 ]
```

### Sorting an array of number DESC

```js
const letters = [1,5,2];
letters.sort((a, b) => b - a);

console.log(letters); // [ 5, 2, 1 ]
```

### Sorting objects in array: Array.sort(cb)

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Jen', age: 20 },
  { name: 'Alice', age: 20 }
];

const sortNamesASC = (a, b) => {
  const nameA = a.name.toUpperCase();
  const nameB = b.name.toUpperCase();
  
  if (nameA < nameB) return -1;
  if (nameA > nameB) return 1;
  
  // for the same name
  return 0;
}

people.sort(sortNamesASC);

// [
//   { name: 'Alice', age: 20 },
//   { name: 'Jen', age: 20 },
//   { name: 'Peter', age: 30 }
// ]
```

If you want to do it in `DESC` order switch...

```js
  if (nameA < nameB) return 1;
  if (nameA > nameB) return -1;
```

This will result in:

```
[
  { name: 'Peter', age: 30 },
  { name: 'Jen', age: 20 },
  { name: 'Alice', age: 20 }
]
```

More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

## Reversing an array

```js
const letters = ['c', 'a', 'b'];
letters.reverse();

console.log(letters); // [ 'b', 'a', 'c' ]
```

## Concatenate arrays

**Spread operator**

```js
const letters1 = ['a', 'b', 'c'];
const letters2 = ['d', 'e', 'f'];

const letters = [...letters1, ...letters2]
console.log(letters); // [ 'a', 'b', 'c', 'd', 'e', 'f' ]
```

**Array.concat(arr)**

```js
const letters1 = ['a', 'b', 'c'];
const letters2 = ['d', 'e', 'f'];

const letters = letters1.concat(letters2);
console.log(letters); // [ 'a', 'b', 'c', 'd', 'e', 'f' ]
```

## Slice an array
If we have an array of objects the reference will be copied but not the object per se.

**Array.slice()** will copy the array.
**Array.slice(startIndex)** will create a new array from starting index until the last element.
**Array.slice(startIndex, endIndex)** will create a new array from starting index until the ending index.

```js
const letters = ['a', 'b', 'c', 'd', 'e'];

const letters1 = letters.slice(1,3);
console.log(letters1); // [ 'b', 'c' ]
```

For copying an array opt for the `spread operator`: 

```js
const letters = ['a', 'b', 'c'];
const newLetters = [...letters];

console.log(newLetters); // [ 'a', 'b', 'c' ]
```

# Joining an array

```js
const letters = ['a', 'b', 'c'];

console.log(letters.join('')); // abc
```

## Find, forEach, every, some, map, reduce and filter

### Array.find(cb)
It takes a callback and it returns the first match or undefined

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Paul', age: 20 },
  { name: 'Paul', age: 10 }
];

const paul1 = people.find(person => person.name === 'Paul'); 

console.log(paul1);
// { name: 'Paul', age: 20 }
```

### Array.forEach(cb)
It takes a callback and executes it once per element.

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Paul', age: 20 },
  { name: 'Paul', age: 10 }
];

const pauls = people.forEach((person, index) => console.log(`${index} - ${person.name}`));
// '0 - Peter'
// '1 - Paul'
// '2 - Paul'
```

### Array.every(cb)
It returns true or false depending on what the expression evaluates to.

The following example returns `false` since we have `1` which is of type `number`.

```js
const mixedArray = ['a', 'b', 'c', 1];

mixedArray.every((element) => typeof element === 'string'); // false
```

### Array.some(cb)
It returns true or false depending on if at least one element matches the expression evaluation result.

```js
const mixedArray = ['a', 'b', 'c', 1];

mixedArray.some((element) => typeof element === 'number'); // true
```

### Array.map(cb)
It returns a new array

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Paul', age: 20 },
  { name: 'Paul', age: 10 }
];

const names = people.map((person) => person.name);
console.log(names);

// [ 'Peter', 'Paul', 'Paul' ]
```

### Array.reduce(cb, initialValue)
It returns a new array

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Paul', age: 20 },
  { name: 'Paul', age: 10 }
];

const agesSum = people.reduce((accumulator, person) => {
  return accumulator + person.age;
}, 0);

console.log(agesSum); // 60
```

### Array.filter(cb)
It returns a new array with the element/s that satisfy the expression evaluation.

```js
const people = [
  { name: 'Peter', age: 30 },
  { name: 'Paul', age: 20 },
  { name: 'Paul', age: 10 }
];

const pauls = people.filter((person) => person.name === 'Paul');

console.log(pauls);

// [
//   { name: 'Paul', age: 20 },
//   { name: 'Paul', age: 10 }
// ]
```
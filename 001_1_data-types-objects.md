# Objects
It is a collection of `keys:values`

We can see an object as the organized representation of "something".
Objects in JS are dynamic... You can add and/or remove properties and methods in an existing object.

For example, the following object represents a `car`:

```js
const car = {};
car.brand = 'Toyota';
car.color = 'black';

console.log(car); // { brand: 'Toyota', color: 'black' }
```

All objects have a `constructor` property which references to the function used to create the object.

For the following examples, the constructors will be:
1. Object() 
2. Object()
3. CreateCar()

Why...?
Because under the hood JS uses the `Object() constructor function` when we are creating objects with the literal syntax.
So, for example, when we do this: `const car = {};`, JS does: `const car = new Object();`

## Creating an object

**1. Object literal syntax**

```js
const car1 = {
  brand: 'Toyota',
  color: 'black',
  drive() {
    // ...do something
  }
};
```

*Quick note*: `drive() {}` and `drive: function() {}` are the same.

**2. Factory functions**
We can create multiple objects using the sample template (in this case, a function that returns an object)

```js
function createCar(brand, color) {
  return {
    brand,
    color,
    drive: function() {
      console.log('Im driving!');
    }
  }
}


const car1 = createCar('Toyota', 'black');
car1.drive();
// Im driving!

const car2 = createCar('Ford', 'green');
car2.drive();
// Im driving!
```

**3. Constructor functions**

```js
function CreateCar(brand, color) {
  // this refers to the object
  this.brand = brand;
  this.color = color;
  this.drive = () => {
    console.log('Im driving!');
  };
}


const car1 = new CreateCar('Toyota', 'black');
car1.drive();
// Im driving!

const car2 = new CreateCar('Ford', 'green');
car2.drive();
// Im driving!
```

The `new` keyword...
1. Creates an `empty object`
2. It will set the newly created object as the value of `this`
3. It `returns` the object

## Manipulating an object

If we want to remove a property or method from the object we can use the `delete` keyword.

```js
const car = {
  brand: 'Toyota',
  color: 'black'
};

console.log(car);
// { brand: 'Toyota', color: 'black' }

delete car.color;
console.log(car);
// { brand: 'Toyota' }
```

And, you can use the `dot notation` to add properties or methods.

```js
const car = {
  brand: 'Toyota',
  color: 'black'
};

console.log(car);
// { brand: 'Toyota', color: 'black' }

car.drive = () => {
  console.log('Im driving!');
};

car.drive();
// // Im driving!
```

## Checking for a property in an object

```js
const obj = {
  name: 'Peter',
  age: 33
}

console.log('age' in obj); // true
```

## Getting object keys and values

```js
const obj = {
  name: 'Peter',
  age: 33
}

// Getting keys
for (let key in obj) {
  console.log(key);
}
// name
// age

// Getting values

for (let key in obj) {
  console.log(obj[key]);
}
// 'Peter'
// 33
```

Alternatively, we can...

1. Get ALL the keys of an object with the method `Object.keys(obj)`

```js
const keys = Object.keys(obj);
for (key of keys) {
  console.log(key);
}
// name
// age
```

2. Get ALL the values of an object with the method `Object.values(obj)`

```js
const values = Object.values(obj);
for (let value of values) {
  console.log(value);
}
// 'Peter'
// 33
```

3. Get ALL key:value pairs in an object

```js
const kvArr = Object.entries(obj);
console.log(kvArr);

// [ [ 'name', 'Peter' ], [ 'age', 33 ] ]
```

## Cloning objects

1. **Spread operator**

```js
const obj = {
  name: 'Peter',
  age: 33
}

const obj1 = { ...obj };
console.log(obj1);
// { name: 'Peter', age: 33 }
```

2. **Object.assign(object, baseObject)**

```js
const obj = {
  name: 'Peter',
  age: 33
}

const obj1 = Object.assign({}, obj);

console.log(obj1);
// { name: 'Peter', age: 33 }
```

*Note*: We can pass an existing object or add properties to the object we are passing to Object.assign()

```js
Object.assign({
  hobbies: []
}, obj);


object.assign(previouslyCreatedObject, obj);
```

## Getters and Setters
* Getters let us access properties of our objects
* Setters let us modify properties

Both create read-only properties (*)

```js
const person = {
  name: 'Peter',
  age: 30,
  get personData() {
    return `${this.name} is ${this.age} old`
  },
  set newName(name) {
    this.name = name;
  }
}

console.log(person.personData);
// 'Peter is 30 old'

person.newName = 'Wendy';

console.log(person.personData);
// 'Wendy is 30 old'
```

(*) As you can see, personData() and newName() are `read-only`

```js
const person = {
  name: 'Peter',
  age: 30,
  get personData() {
    return `${this.name} is ${this.age} old`
  },
  set newName(name) {
    this.name = name;
  }
}

person.name = 'Paul';
person.personData = 1;
person.newName = 2;

console.log(person);

// {
//   name: 2,
//   age: 30,
//   personData: [Getter],
//   newName: [Setter]
// }
```

A similar example using a `Constructor function` and `Object.defineProperty()` (getters and setters)

```js
function Person(name) {
  this.name = name;

  Object.defineProperty(this, 'name', {
    get() {
      return name;
    },
    set(value) {
      name = value;
    }
  });
}

const peter = new Person('Peter');

console.log(peter);
// Person { name: [Getter/Setter] }

console.log(peter.name);
// Peter

peter.name = 'Paul';

console.log(peter.name);
// Paul
```

## Property descriptors

We can use `Object.getOwnPropertyDescriptors(obj)` to get the `property descriptors` of a given object.

```js
function Person(name) {
  this.name = name;
}

const peter = new Person("Peter");

Object.getOwnPropertyDescriptors(peter);

// {
//   name: {
//     value: 'Peter',
//     writable: true,
//     enumerable: true,
//     configurable: true
//   }
// }
```

Notes:
1. `value` is the value associated with the property
2. `writable` if the value can be changed
3. `enumerable` if its showed during enumerations (like looping)
4. `configurable` if we can delete the member or not

We can use `Object.defineProperty()` to set the `property descriptors attributes`: 
* value
* writable
* get
* set
* configurable
* enumerable

```js
function Person(name) {
  this.name = name;

  Object.defineProperty(this, 'name', {
    writable: false,
    enumerable: false,
    value: 'Mike',
    configurable: false
  });
}

let person = new Person('Peter');
person.name = 'Paul';
console.log(person.name);
// Mike

Object.keys(person);
// []

delete person.name;
// false
```

In the previous example...
1. We will not be able to change the value
2. We will not be able to list the property name
3. We will set Mike as the value
4. We will not be able to delete the property
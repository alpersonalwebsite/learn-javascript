# Error handling

## Try and Catch

```js
const person = {
  name: 'Peter',
  age: 30,
  get personData() {
    return `${this.name} is ${this.age} old`;
  },
  set newName(name) {
    if (typeof name !== 'string') {
      throw new Error('Name must be a string');
    }
    this.name = name;
  }
}

try {
  person.newName = 1; 
} catch (err) {
  console.error(err);
}

// Error: 'Name must be a string'
```
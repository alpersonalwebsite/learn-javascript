# Currying

The Table of Contents has promised this page for a while and it did not exist, so here it is.

Currying is worth a page because the word gets used for two different things, and because the
generic implementation everyone copies has a failure mode that is invisible until it bites. Practical
notes, not a treatment of the theory: if you want the lambda calculus behind the name (it comes from
Haskell Curry) then [Wikipedia](https://en.wikipedia.org/wiki/Currying) is the place, and MDN is the
authority on [`Function.prototype.bind`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).

Everything below was run before it was written down.

## The idea, on one function

Start with an ordinary function of three arguments:

```js
function volume(l, w, h) {
  return l * w * h;
}

console.log(volume(2, 3, 4)); // 24
```

Currying turns that into a chain of one-argument functions, each returning the next:

```js
const volume = (l) => (w) => (h) => l * w * h;

console.log(volume(2)(3)(4)); // 24
```

Every call but the last hands you back a function rather than a number:

```js
const volume = (l) => (w) => (h) => l * w * h;

console.log(typeof volume(2));    // function
console.log(typeof volume(2)(3)); // function
```

That is the whole mechanism. What makes it useful is the middle of the chain: `volume(2)` is a
reusable thing, "the volume of anything two units long", and you can hold onto it and finish it later
with arguments you do not have yet.

## Currying is not partial application, though people say it is

The two get used interchangeably and they are different. **Currying** converts one n-argument
function into n one-argument functions. **Partial application** fixes some arguments now and leaves
the rest for later, with no requirement that anything take exactly one argument.

JavaScript has partial application built in, and it is `bind`:

```js
function volume(l, w, h) {
  return l * w * h;
}

const twoLong = volume.bind(null, 2);

console.log(twoLong(3, 4)); // 24
```

`twoLong` takes *two* arguments, not one, which is what makes it partial application rather than
currying. Two properties of the bound function are worth knowing, because they are the only visible
evidence of what `bind` did:

```js
function volume(l, w, h) {
  return l * w * h;
}

const twoLong = volume.bind(null, 2);

console.log(twoLong.length); // 2
console.log(twoLong.name);   // 'bound volume'
```

`length` has dropped from 3 to 2, counting only what is still unsupplied, and `name` is prefixed
rather than empty, which is a small kindness when you are staring at a stack trace. The `null` first
argument is the `this` binding, unused here (see [This](./005_1_this.md)), and it has to be passed to
get to the arguments after it.

## A generic curry, and how it knows when to stop

Writing the arrow chain by hand is fine for one function and tedious for a codebase, so the usual
move is a `curry` that wraps any function:

```js
function curry(fn) {
  return function next(...args) {
    return args.length >= fn.length
      ? fn(...args)
      : (...more) => next(...args, ...more);
  };
}

function volume(l, w, h) {
  return l * w * h;
}

const curried = curry(volume);
```

The pleasant part is that it does not care how you group the arguments, because it only counts them:

```js
// check: continues
console.log(curried(2)(3)(4)); // 24
console.log(curried(2, 3)(4)); // 24
console.log(curried(2)(3, 4)); // 24
console.log(curried(2, 3, 4)); // 24
```

All four are 24. Note what the implementation is actually leaning on: `fn.length`, the function's
declared arity, is the only thing telling it whether it has enough arguments yet.

## Where that breaks, which is the part worth remembering

`fn.length` does not mean "how many parameters were written". It means "how many parameters appear
before the first one with a default value, and before any rest parameter". Measured:

```js
console.log(((a, b, c) => 0).length);     // 3
console.log(((a, b = 2, c) => 0).length); // 1
console.log(((a, ...rest) => 0).length);  // 1
console.log((({ a, b }) => 0).length);    // 1
```

The second line is the surprising one. Three parameters are written and `length` is `1`, because
counting stops at `b`. A destructured object also counts as one, which is reasonable once you see it
but not obvious.

Now feed such a function to the `curry` above:

```js
function curry(fn) {
  return function next(...args) {
    return args.length >= fn.length
      ? fn(...args)
      : (...more) => next(...args, ...more);
  };
}

const add = (a, b = 1) => a + b;

console.log(curry(add)(5)); // 6

const count = (...n) => n.length;

console.log(curry(count)()); // 0
```

That returns `6`, not a function waiting for `b`. `add.length` is `1`, so one argument already looks
like a full set, `add(5)` runs immediately, and `b` quietly falls back to its default. Nothing throws
and nothing warns. You asked for a curried function and got an answer.

A rest parameter is worse, and the last two lines above show it: the arity is `0`, so the call
happens before you have supplied anything at all, and `curry(count)()` is `0` rather than a function
waiting for something to count.

So: an arity-driven `curry` only works on functions with a fixed, plainly-declared parameter list. If
you want it to work on the rest, you have to pass the arity in yourself (`curry(fn, 3)`) rather than
letting it guess, and that is the version worth writing if these functions are going anywhere near
other people's code.

## When it is actually worth doing

Honestly, in day-to-day JavaScript, less often than tutorials imply. The cases where it pays:

- **A fixed configuration argument followed by varying data.** A logger that takes a level and a
  message becomes `log('warn')` once, then a plain message-taking function everywhere after.
- **Callbacks that want a one-argument function.** `map`, `filter` and friends pass one useful value,
  so a curried transformer drops straight in with no wrapper arrow.
- **Composition.** Chaining functions together only works cleanly when each takes one argument, so
  currying is the thing that makes a `compose` or `pipe` usable at all.

Against that: a chain of one-argument closures is harder to read than a function with three named
parameters, harder to step through in a debugger, and `bind` already covers the common case. Reach
for it when the shape of the problem asks for it, not because the pattern has a name.

## Not covered here

- **`compose` and `pipe`**, which are the reason currying is load-bearing in functional codebases
  and deserve their own page.
- **Library implementations.** Lodash's `curry` handles placeholders and explicit arity and is a
  much more careful piece of code than the ten-line version above, which is here to be understood
  rather than used.
- **Performance.** Each link in the chain is a closure and an extra call, which has never been the
  bottleneck in anything I have written, but it is not free either.

# Learning JavaScript

**IMPORTANT**: Until new advise this will be more a collection of notes than a structured breviary.

In 2018, the CTO of the company I was working for, entrusted me with the task of moving from unorganized JS to a JS MVC-ish implementation with React. For this purpose I created a repository to highlight some concepts and summarize the framework. It worked well (well enough), however, I found myself constantly going back and forth between React and JavaScript, something that polluted other training materials like Node (environment), Express (library), Vue (framework)... All these tutorials shared something in common: the language, JavaScript.

Looking back, I see several repetitions that are not strictly related to the topic of some of those essays, but you definitely need to understand them before moving on. Someday I will make time to do a cleanup, but erstwhile, I need to consolidate all that knowledge in one place. This is learning JavaScript.

## Checking the samples

The samples here are not decoration, they are claims. A line like

```js
console.log(typeof 'literal'); // string
```

says something about what JavaScript does, so the claims are checked rather than trusted: every
block is parsed, the self-contained ones are run, and each trailing comment is compared against what
actually came out. A note that says `// 5` over a line that prints `6` fails the build.

```shell
npm run check-samples   # parse, run, and verify the stated output
npm run check-links     # every relative link and #anchor resolves
npm run check           # both
```

No dependencies to install and no network needed. The checkers use only what ships with Node, and
[scripts/check-samples.mjs](./scripts/check-samples.mjs) explains what it does and does not verify,
including the blocks it deliberately skips and why.

## Table of Contents

- [Intro](./00_0_intro.md)
- [Variables](./00_1_variables.md)
- [Primitive Data Types and Operators](./001_0_data-types-and-operators.md)
- Reference Data Types
    - [Objects](./001_1_data-types-objects.md)
    - [Arrays](./001_2_data-types-arrays.md)
    - [Functions](./001_3_data-types-functions.md)
- [Statements and Loops](./002_0_statements-and-loops.md)
- [Error handling](./003_0_error-handling.md)
- [Currying](./004_1_currying.md)
    - [Currying is not partial application](./004_1_currying.md#currying-is-not-partial-application-though-people-say-it-is)
    - [A generic curry, and how it knows when to stop](./004_1_currying.md#a-generic-curry-and-how-it-knows-when-to-stop)
    - [Where that breaks](./004_1_currying.md#where-that-breaks-which-is-the-part-worth-remembering)
- [Scope](./005_0_scope.md)
- [This](./005_1_this.md)
- [OOP](./006_0_OOP.md)
    - [Fundamentals of OOP](./006_0_OOP.md#fundamentals-of-oop)
    - [Inheritance](./006_0_OOP.md#inheritance)
    - [Polymorphism](./006_0_OOP.md#polymorphism)
- [Closures](./007_0_closures.md)
- [Async JS](./async.md)
    - [Callbacks](./async.md#callbacks)
    - [Callback hell](./async.md#callback-hell)
    - [Promises](./async.md#promises)
    - [Promise.all, Promise.race, Promise.resolve](./async.md#promiseallarrayofpromises)
    - [Async/Await](./async.md#asyncawait)

### Older notes

These four came from the earlier repositories described above, before any of this was consolidated,
and they have not been merged into the numbered files. They overlap: OOP is covered both here and in
[OOP](./006_0_OOP.md), and async both here and in [Async JS](./async.md). Where they disagree in
depth, prefer the numbered files, which are the newer pass. They are kept because they are not
strictly a subset, and rewriting 1000 lines of prose to merge them would introduce more errors than
it removed.

- [OOP with JS](./Z_00_0_basic-oop-with-js.md)
    - [Creating or initializing objects](./Z_00_0_basic-oop-with-js.md#creating-or-initializing-objects)
    - [Adding properties](./Z_00_0_basic-oop-with-js.md#adding-properties)
    - [Removing properties](./Z_00_0_basic-oop-with-js.md#removing-properties)
- [ES6 or ES2015](./Z_00_0_basic-es2015.md)
    - [let and const](./Z_00_0_basic-es2015.md#let-and-const)
    - [Template literals](./Z_00_0_basic-es2015.md#template-literals)
    - [Destructuring assignment](./Z_00_0_basic-es2015.md#destructuring-assignment)
    - [Arrow function](./Z_00_0_basic-es2015.md#arrow-function)
    - [Classes](./Z_00_0_basic-es2015.md#classes)
- [Callbacks, Promises and Async/Await](./Z_00_0_callbacks-promises-async_await.md)

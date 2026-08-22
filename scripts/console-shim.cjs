// Preloaded with --require so the sample under test runs byte-for-byte, with its own line numbers
// intact. Wrapping console.log inside the sample would mean editing the thing being checked, which
// is the one thing a checker must not do.
//
// Each call records two things: the text node itself would print, and the LINE of the sample that
// produced it. The line is what makes per-claim assertions possible. Counting calls and comparing
// positionally does not work here, because a console.log in a loop produces several lines and a
// console.log inside a method that is never called produces none, so position stops corresponding
// to source order. With the line recorded, each source line can be judged on its own: produced
// exactly one output, so its trailing comment is checkable; produced several or none, so it is not.
const { inspect } = require('node:util')
const recorded = []
const realLog = console.log.bind(console)

// The sample is always written to a file whose basename is this. Frames from node internals and
// from this shim are skipped, so the frame found is the sample's own.
const SAMPLE = 'sample.js'

function callerLine() {
  const stack = new Error().stack || ''
  for (const frame of stack.split('\n').slice(1)) {
    const m = new RegExp(SAMPLE.replace('.', '\\.') + ':(\\d+):\\d+').exec(frame)
    if (m) return Number(m[1])
  }
  return null
}

console.log = (...args) => {
  recorded.push({
    line: callerLine(),
    text: args.map((a) => (typeof a === 'string' ? a : inspect(a))).join(' '),
  })
}
// console.error and console.warn are left alone: a sample that logs a warning is not making a claim
// about output, and swallowing them would hide a genuine problem.

// On exit, not after the last statement: a sample whose logs happen in a setTimeout or a resolved
// promise has not logged anything yet when the main script ends. This fires once the loop drains.
process.on('exit', () => {
  realLog('__RECORDED__' + JSON.stringify(recorded))
})

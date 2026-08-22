#!/usr/bin/env node
// Checks the code samples in these notes three ways, each one strictly stronger than the last.
//
// 1. SYNTAX. Every ```js block is parsed with `node --check`.
//
// 2. EXECUTION. Self-contained blocks are run. This matters more here than in most notes
//    repositories, because a JavaScript sample can parse perfectly and still throw the moment it
//    runs, and nothing else in a markdown repository would ever notice.
//
// 3. OUTPUT ASSERTIONS. These notes are written in one dominant style:
//
//        console.log(typeof stringLiteral); // string
//
//    which is not decoration, it is a claim about what JavaScript does. So the claims are checked:
//    the block runs, every console.log call is recorded, and each trailing comment is compared
//    against what actually came out. A note that says `// 5` over a line that prints 6 fails here.
//
// SEMANTICS: samples run as CommonJS SCRIPTS, not ES modules, and that is deliberate. These notes
// assume sloppy-mode, browser-console semantics: 005_1_this.md logs top-level `this` eight times,
// which is `module.exports` in a script and `undefined` in a module, so running them as modules
// would make the notes look wrong when they are right. It also changes what counts as an error:
// `function Cat() {}` twice is a SyntaxError in a module and legal in a script. Measured on
// 006_0_OOP.md, which does exactly that: as a module it will not parse, as a script it runs and
// prints what the notes say it prints, because the declarations hoist and the runtime
// `Cat.prototype = ...` assignments land on the surviving binding. Script mode is the honest
// reading of what these samples are.
//
// OPT-OUTS. Some blocks legitimately cannot be run, and each says so on its FIRST line:
//
//     // check: fragment     not standalone code (a function body, a clause). Not parsed, not run.
//     // check: continues    complete code, but builds on a variable an earlier block declared.
//                            Parsed, not run. Kept separate from "fragment" on purpose: a fragment
//                            cannot be parsed at all, while these can and should be, so folding
//                            them together would silently drop a syntax check that does work.
//     // check: browser      needs window/document. Parsed, not run.
//     // check: throws Name  the sample demonstrates an error; it MUST throw that error.
//     // check: slow         real timers; gets a longer timeout.
//
// The marker is honoured ONLY on the first line of a block, and only as a comment. That is
// deliberately tighter than "any comment line": a marker that can be attached anywhere can be
// attached to the offending line itself, which turns an exemption into an off switch reachable from
// inside the thing being checked. That was found by poison-testing the looser form in a sibling
// notes repository, where appending the marker to a genuinely broken call silenced it.
//
// The shim is .cjs, and package.json deliberately sets no "type": it is loaded with --require and
// so must be CommonJS, while these checkers are .mjs and are ES modules either way.
//
// SPEED. Blocks are checked concurrently, one child process each, because five samples in async.md
// use real 3-second timers and cannot be made faster without changing what they teach. Serially the
// whole run took 46s, which is long enough that a check stops being run, and that is the same
// failure as needing a database. Each block gets its own temp file, so nothing is shared.
//
// Usage:  node scripts/check-samples.mjs [--list]

import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { execFile, execFileSync } from 'node:child_process'
import { availableParallelism } from 'node:os'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const run = promisify(execFile)

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const args = new Set(process.argv.slice(2))
const SHIM = join(here, 'console-shim.cjs')
const TIMEOUT_MS = 5000
const SLOW_TIMEOUT_MS = 20000

// ---------------------------------------------------------------- extract

const MARKER = /^\/\/\s*check:\s*(fragment|continues|browser|slow|throws\s+\w+)\s*$/

function blocks() {
  const out = []
  for (const file of readdirSync(root).filter((f) => f.endsWith('.md')).sort()) {
    const lines = readFileSync(join(root, file), 'utf8').split('\n')
    let cur = null
    for (const [i, line] of lines.entries()) {
      const t = line.trim()
      if (cur) {
        if (t === '```') { out.push(cur); cur = null } else cur.body.push(line)
        continue
      }
      // Only js/javascript. The intro's ```java block is Java on purpose, contrasting static
      // typing, and the bare ``` blocks are console output rather than code.
      if (/^```(js|javascript)\s*$/.test(t)) cur = { file, line: i + 1, body: [] }
    }
    // An unterminated fence is itself a defect: it silently swallows the rest of the file.
    if (cur) out.push({ ...cur, unterminated: true })
  }
  for (const b of out) {
    const m = MARKER.exec((b.body[0] ?? '').trim())
    b.mark = m ? m[1].replace(/\s+/g, ' ') : null
    b.src = b.body.join('\n')
  }
  return out
}

// ------------------------------------------------------- expected outputs

// A trailing comment on a console.log line is the claim. Only claims that node prints
// UNAMBIGUOUSLY are asserted: a bare word, a number, a quoted string, or a keyword literal.
// Object and function shapes are recorded as unasserted rather than compared, because the notes
// quote Chrome DevTools formatting for those (`ƒ Cat()`, `__proto__:`) which node does not produce,
// and a checker that fails on a formatting difference would be turned off within a week.
const COMPARABLE = /^(?:'[^']*'|"[^"]*"|-?\d+(?:\.\d+)?|true|false|undefined|null|NaN|Infinity|-Infinity|[A-Za-z_$][\w$]*)$/

// Returns { line, want } for every console.log line that states what it prints. These notes use
// two styles and both are read:
//
//     console.log(typeof x);        // string        <- same line
//
//     console.log(person.name);
//     // Peter                                       <- the line below
//
// The second form is only read when EXACTLY ONE comment line follows. A run of them is how the
// notes lay out an object or a multi-line template, and it is also how a paragraph of prose gets
// parked under a sample, so treating a run as expected output would mean guessing where output ends
// and commentary begins. One line is unambiguous. Measured on this repository: 35 claims in the
// same-line style, 50 in the following-line style, so reading only the first would leave more than
// half the stated behaviour in these notes unchecked.
function claims(body) {
  const found = []
  for (const [i, line] of body.entries()) {
    if (!/\bconsole\.log\s*\(/.test(line)) continue
    const same = /\/\/\s*(.*)$/.exec(line)
    if (same) { found.push({ line: i + 1, want: same[1].trim() }); continue }
    const next = body[i + 1]?.trim() ?? ''
    const after = body[i + 2]?.trim() ?? ''
    // Exactly one: the line after must be a comment, the one after that must not be.
    if (next.startsWith('//') && !after.startsWith('//')) {
      found.push({ line: i + 1, want: next.replace(/^\/\/\s?/, '').trim() })
    }
  }
  return found
}

const unquote = (s) => (/^(['"]).*\1$/.test(s) ? s.slice(1, -1) : s)

// ------------------------------------------------------------------- run

const dir = mkdtempSync(join(tmpdir(), 'learn-js-'))
const all = blocks()

if (args.has('--list')) {
  for (const b of all) console.log(`${b.file}:${b.line}  ${b.body.length} lines  ${b.mark ?? ''}`)
  rmSync(dir, { recursive: true, force: true })
  process.exit(0)
}

const fail = []
let parsed = 0, ran = 0, threwAsDocumented = 0
let assertedBlocks = 0, assertedClaims = 0, unassertedClaims = 0, unassertableClaims = 0, skippedClaims = 0

async function check(b, index) {
  const where = `${b.file}:${b.line}`
  if (b.unterminated) { fail.push(`UNTERMINATED FENCE ${where}`); return }
  if (b.mark === 'fragment') { skippedClaims += claims(b.body).length; return }

  // One file per block, named sample.js because the shim resolves call sites by that basename.
  const own = mkdtempSync(join(dir, `b${index}-`))
  const path = join(own, 'sample.js')
  writeFileSync(path, b.src)
  try {
    try {
      await run(process.execPath, ['--check', path])
      parsed++
    } catch (e) {
      const msg = String(e.stderr).split('\n').find((l) => /Error/.test(l)) ?? 'parse failed'
      fail.push(`SYNTAX ${where}  ${msg.trim()}`)
      return
    }

    if (b.mark === 'browser' || b.mark === 'continues') {
      // Counted, not ignored. These blocks state what they print and nothing here checks it, so
      // leaving them out of the tally would make the coverage figure flatter than the truth.
      skippedClaims += claims(b.body).length
      return
    }

    const wantThrow = b.mark?.startsWith('throws ') ? b.mark.slice(7) : null
    const timeout = b.mark === 'slow' ? SLOW_TIMEOUT_MS : TIMEOUT_MS
    let stdout
    try {
      ;({ stdout } = await run(process.execPath, ['--require', SHIM, path], { timeout }))
      if (wantThrow) { fail.push(`EXPECTED THROW ${where}  marked "throws ${wantThrow}" but exited cleanly`); return }
      ran++
    } catch (e) {
      const err = String(e.stderr ?? '')
      if (wantThrow) {
        if (err.includes(wantThrow)) { threwAsDocumented++; return }
        fail.push(`WRONG ERROR ${where}  marked "throws ${wantThrow}", got: ${(err.split('\n').find((l) => /Error/.test(l)) ?? '?').trim()}`)
        return
      }
      if (e.killed || e.signal === 'SIGTERM') {
        fail.push(`TIMEOUT ${where}  exceeded ${timeout}ms (mark it "// check: slow" if the timers are real)`)
        return
      }
      fail.push(`RUNTIME ${where}  ${(err.split('\n').find((l) => /Error/.test(l)) ?? 'failed').trim()}`)
      return
    }

    const rec = /__RECORDED__(.*)$/m.exec(stdout)
    if (!rec) { fail.push(`NO RECORD ${where}  the shim produced no output`); return }
    const actual = JSON.parse(rec[1])

    // Group output BY THE SOURCE LINE that produced it. Matching by call order does not work: a
    // console.log in a loop emits several lines, and one inside a method that is never called emits
    // none, so the Nth output stops being the Nth log statement. Per line, each claim is judged on
    // evidence about that line alone.
    const byLine = new Map()
    for (const r of actual) {
      if (r.line === null) continue
      if (!byLine.has(r.line)) byLine.set(r.line, [])
      byLine.get(r.line).push(r.text)
    }

    let assertedHere = 0
    for (const { line, want } of claims(b.body)) {
      const got = byLine.get(line) ?? []
      // Ran more than once (a loop) or never (an uncalled function): the trailing comment may be
      // perfectly correct, but this block has no single value to compare it against.
      if (got.length !== 1) { unassertableClaims++; continue }
      if (!COMPARABLE.test(want)) { unassertedClaims++; continue }
      if (unquote(want) === got[0]) { assertedClaims++; assertedHere++ }
      else fail.push(`WRONG OUTPUT ${where} (block line ${line})  claims ${JSON.stringify(want)}, prints ${JSON.stringify(got[0])}`)
    }
    if (assertedHere > 0) assertedBlocks++
  } finally {
    rmSync(own, { recursive: true, force: true })
  }
}

// Bounded concurrency: enough to hide the 3-second timers, not enough to thrash.
const LIMIT = Math.max(2, Math.min(8, availableParallelism() - 1))
const queue = all.map((b, i) => [b, i])
await Promise.all(Array.from({ length: LIMIT }, async () => {
  for (;;) {
    const next = queue.shift()
    if (!next) return
    await check(next[0], next[1])
  }
}))

// Deterministic output regardless of which worker finished first.
fail.sort()

rmSync(dir, { recursive: true, force: true })

const marked = all.filter((b) => b.mark)
console.log(`${all.length} js blocks: ${parsed} parsed, ${ran} ran, ${threwAsDocumented} threw as documented`)
console.log(`  opt-outs: ${marked.length} (${['fragment', 'continues', 'browser', 'slow'].map((k) => `${marked.filter((b) => b.mark === k).length} ${k}`).join(', ')}, ${marked.filter((b) => b.mark?.startsWith('throws')).length} throws)`)
console.log(`  assertions: ${assertedClaims} claims verified across ${assertedBlocks} blocks`)
console.log(`  not asserted: ${unassertedClaims} object/function-shaped, ${unassertableClaims} in a loop or never reached, ${skippedClaims} in blocks that are not run`)

if (fail.length === 0) { console.log('no failures'); process.exit(0) }
console.log('')
for (const f of fail) console.error(f)
console.error(`\n${fail.length} failure(s)`)
process.exit(1)

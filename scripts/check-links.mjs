#!/usr/bin/env node
// Checks every relative markdown link in the repository: that the target file exists, and that any
// #fragment matches a heading in it.
//
// Worth having because a broken anchor is a SILENT failure. GitHub serves the page with a 200 and
// ignores the fragment, so the reader lands at the top of a 600-line file with nothing telling them
// the link was wrong. Nothing but a mechanical pass ever finds one.
//
// The anchor rules are a reimplementation of GitHub's sluggification, so they were checked against
// the real thing rather than assumed: all 95 headings in this repository were POSTed to GitHub's
// own markdown renderer (`gh api --method POST /markdown`) and the `id="user-content-..."` values it
// generated were compared against what slug() produces. 95 headings, 0 mismatches, with the
// comparison aborting rather than reporting success if the two lists could not be aligned, since a
// zip over an empty response is how a verification passes vacuously.
//
// Three cases from that run are worth keeping in mind, and are pinned in SLUG_CASES below:
//
//   'Arrow functions & this'  ->  arrow-functions--this      TWO hyphens
//   'Salt, hash and compare'  ->  salt-hash-and-compare      ONE hyphen
//   'this in a "method"'      ->  this-in-a-method           quotes vanish
//
// The first two look inconsistent and are not. Punctuation is deleted, and only then does each
// remaining space become a hyphen: `&` has a space on both sides so both survive as hyphens, while
// the comma in `Salt,` has none before it, so one space produces one hyphen. Getting this backwards
// is how a plausible-looking slugger emits anchors that all resolve except the handful nobody
// checks.
//
// The self-check is offline on purpose. A checker that needs the network is one that stops being
// run, which is the same failure as needing a database.

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

const slug = (heading) =>
  heading
    .replace(/`/g, '')
    // Link text inside a heading: keep the text, drop the target.
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .toLowerCase()
    .replace(/[^\p{L}\p{N} _-]/gu, '')
    .trim()
    .replace(/ /g, '-')

// Pinned against GitHub's renderer (see above). If slug() ever drifts, this fails loudly here
// rather than producing a file full of plausible wrong anchors.
const SLUG_CASES = [
  ['Data Types and Operators', 'data-types-and-operators'],
  ['Primitives or value types', 'primitives-or-value-types'],
  ['Arrow functions & this', 'arrow-functions--this'],
  ['Salt, hash and compare', 'salt-hash-and-compare'],
  ['this in a "method"', 'this-in-a-method'],
  ['Create or post()', 'create-or-post'],
  ['SemVer (Semantic versioning)', 'semver-semantic-versioning'],
  ['Handling `uncaughtException` and `unhandledRejection`', 'handling-uncaughtexception-and-unhandledrejection'],
]
for (const [input, expected] of SLUG_CASES) {
  const got = slug(input)
  if (got !== expected) {
    console.error(`slug() self-check failed: ${JSON.stringify(input)} -> ${got}, expected ${expected}`)
    process.exit(1)
  }
}

const mdFiles = readdirSync(root).filter((f) => f.endsWith('.md')).sort()

// Anchors each file offers, and the links each file makes. Both passes skip fenced code, so a
// heading inside a shell sample is not an anchor and a URL inside a code block is not a link.
const anchors = new Map()
const links = []

for (const file of mdFiles) {
  const lines = readFileSync(join(root, file), 'utf8').split('\n')
  const seen = new Map()
  const set = new Set()
  let inFence = false

  for (const [i, line] of lines.entries()) {
    if (line.trim().startsWith('```')) { inFence = !inFence; continue }
    if (inFence) continue

    const heading = /^#{1,6} +(.*)$/.exec(line)
    if (heading) {
      const base = slug(heading[1])
      const n = seen.get(base) ?? 0
      seen.set(base, n + 1)
      // GitHub appends -1, -2 to repeats, per document.
      set.add(n === 0 ? base : `${base}-${n}`)
    }

    for (const [, target] of line.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('//')) continue
      links.push({ file, line: i + 1, target })
    }
  }
  anchors.set(file, set)
}

const problems = []
for (const { file, line, target } of links) {
  const [path, fragment] = target.split('#')
  const resolved = path === ''
    ? file
    : normalize(join(dirname(join(root, file)), path)).replace(`${root}/`, '')

  if (path !== '' && !mdFiles.includes(resolved)) {
    // Not markdown, so there are no headings to check, but the file still has to be there. The
    // first version only knew about .md and reported every link to a script as missing, which is
    // both a false alarm and a blind spot: a genuinely dead link to a non-markdown file would
    // never have been caught either.
    if (!existsSync(join(root, resolved))) {
      problems.push({ file, line, target, why: `no such file: ${resolved}` })
    } else if (fragment) {
      problems.push({ file, line, target, why: `${resolved} is not markdown, so #${fragment} cannot resolve` })
    }
    continue
  }
  if (fragment && !anchors.get(resolved).has(fragment)) {
    problems.push({ file, line, target, why: `no heading in ${resolved} with anchor #${fragment}` })
  }
}

console.log(`${links.length} relative links across ${mdFiles.length} files`)
if (problems.length === 0) { console.log('all resolve'); process.exit(0) }
for (const p of problems) console.error(`  ${p.file}:${p.line}  ${p.target}\n      ${p.why}`)
console.error(`\n${problems.length} broken link(s)`)
process.exit(1)

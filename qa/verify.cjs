// Independent behavioral checks written by Codex, using Node's built-in assert.
const assert = require('node:assert/strict');
const round = process.argv[2] || '1';
if (!['1', '2'].includes(round)) throw new Error('Expected round 1 or 2');
const { sumPositive } = require(`./round-${round}.cjs`);
const cases = [
  { name: 'mixed signs', input: [1, -2, 3, 0], expected: 4 },
  { name: 'empty', input: [], expected: 0 },
  { name: 'negative only', input: [-1, -5], expected: 0 },
  { name: 'positive only', input: [2, 3, 5], expected: 10 },
];
if (round === '2') {
  cases.push(
    { name: 'ignore invalid values', input: [1, '2', null, true, NaN, Infinity, -Infinity, -3, 4.5], expected: 5.5 },
    { name: 'invalid only', input: ['2', undefined, {}, [], NaN, Infinity], expected: 0 },
    { name: 'finite decimals', input: [0.25, 0.5, -0.5, -0], expected: 0.75 },
    { name: 'no coercion', input: [1, { valueOf() { throw new Error('must not coerce'); } }, 2], expected: 3 },
  );
}
for (const { name, input, expected } of cases) {
  const original = input.slice();
  Object.freeze(input);
  assert.equal(sumPositive(input), expected, name);
  assert.deepEqual(input, original, `${name}: unchanged input`);
}
console.log(JSON.stringify({ round: Number(round), cases: cases.length, assertions: cases.length * 2, status: 'passed', runtime: process.version }));

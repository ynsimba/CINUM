const test = require('node:test');
const assert = require('node:assert/strict');
const { isStrongPassword } = require('./passwordPolicy');

test('accepts strong passwords', () => {
  assert.equal(isStrongPassword('Abcdef!234'), true);
});

test('rejects weak passwords', () => {
  assert.equal(isStrongPassword('abcdef1234'), false);
  assert.equal(isStrongPassword('ABCDEF!234'), false);
  assert.equal(isStrongPassword('Abcd!efgh'), false);
});

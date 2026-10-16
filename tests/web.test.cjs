const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');

// Compile the actual web implementation without loading the native Expo bridge.
const source = fs.readFileSync(require.resolve('../src/ExpoGbkConverterModule.web.ts'), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});
const compiled = { exports: {} };
new Function('exports', 'module', outputText)(compiled.exports, compiled);
const { decode } = compiled.exports.default;
const base64 = (bytes) => Buffer.from(bytes).toString('base64');

test('decodes GBK Chinese text', async () => {
  assert.equal(await decode(base64([0xd6, 0xd0, 0xce, 0xc4])), '中文');
});

test('decodes a four-byte GB18030 character outside GBK', async () => {
  assert.equal(await decode(base64([0x90, 0x30, 0x81, 0x30])), '\u{10000}');
});

test('preserves ASCII, CSV line endings, and empty input', async () => {
  const csv = 'amount,note\r\n12.50,test\r\n';
  assert.equal(await decode(base64(csv)), csv);
  assert.equal(await decode(''), '');
});

test('rejects malformed base64 asynchronously', async () => {
  await assert.rejects(decode('%%%'));
});

test('rejects truncated GB18030 instead of inserting replacement characters', async () => {
  await assert.rejects(decode(base64([0x81])), TypeError);
  await assert.rejects(decode(base64([0x90, 0x30, 0x81])), TypeError);
});

test('rejects non-string input', async () => {
  await assert.rejects(decode(null), TypeError);
});

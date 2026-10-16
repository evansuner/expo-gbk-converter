const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');

const pkg = JSON.parse(read('package.json'));
const gradle = read('android/build.gradle');
const podspec = read('ios/ExpoGbkConverter.podspec');
const moduleConfig = JSON.parse(read('expo-module.config.json'));
const kotlin = read('android/src/main/java/expo/modules/gbkconverter/ExpoGbkConverterModule.kt');
const swift = read('ios/ExpoGbkConverterModule.swift');
const typescript = read('src/ExpoGbkConverterModule.ts');

const matchOne = (source, pattern, label) => {
  const match = source.match(pattern);
  assert.ok(match, `Could not find ${label}`);
  return match[1];
};

test('version is declared identically in package.json, build.gradle and the podspec', () => {
  const versions = {
    'package.json': pkg.version,
    'android/build.gradle version': matchOne(gradle, /^version\s*=\s*'([^']+)'/m, 'version'),
    'android/build.gradle versionName': matchOne(gradle, /versionName\s+"([^"]+)"/, 'versionName'),
    'ios/ExpoGbkConverter.podspec': matchOne(podspec, /s\.version\s*=\s*'([^']+)'/, 's.version'),
  };

  const declared = new Set(Object.values(versions));
  assert.equal(
    declared.size,
    1,
    `Version drift detected: ${JSON.stringify(versions, null, 2)}`
  );
});

test('the Android namespace matches the Kotlin package', () => {
  const namespace = matchOne(gradle, /namespace\s+"([^"]+)"/, 'android namespace');
  const kotlinPackage = matchOne(kotlin, /^package\s+([\w.]+)/m, 'Kotlin package declaration');

  assert.equal(namespace, kotlinPackage);
});

test('expo-module.config.json registers the native class that actually exists', () => {
  const namespace = matchOne(gradle, /namespace\s+"([^"]+)"/, 'android namespace');
  const kotlinClass = matchOne(kotlin, /class\s+(\w+)\s*:\s*Module\(\)/, 'Kotlin module class');
  const swiftClass = matchOne(swift, /class\s+(\w+)\s*:\s*Module\b/, 'Swift module class');

  assert.deepEqual(moduleConfig.platforms, ['apple', 'android', 'web']);

  // Both Apple and Android reference the class by the same simple name (checked below),
  // so the registered FQCN must be the Kotlin package plus that class name.
  assert.equal(kotlinClass, swiftClass);
  assert.deepEqual(moduleConfig.android.modules, [`${namespace}.${kotlinClass}`]);
  assert.deepEqual(moduleConfig.apple.modules, [swiftClass]);
});

test('the native module name is identical on every platform', () => {
  const name = matchOne(kotlin, /Name\("([^"]+)"\)/, 'Kotlin Name()');
  const swiftName = matchOne(swift, /Name\("([^"]+)"\)/, 'Swift Name()');
  const jsName = matchOne(typescript, /requireNativeModule[\s\S]*?\('([^']+)'\)/, 'requireNativeModule()');

  assert.equal(swiftName, name);
  assert.equal(jsName, name);
});

test('the published tarball ships every platform and no dead files', () => {
  for (const entry of ['build', 'src', 'android', 'ios', 'expo-module.config.json']) {
    assert.ok(pkg.files.includes(entry), `package.json "files" is missing "${entry}"`);
  }

  assert.ok(
    !pkg.files.includes('app.plugin.js'),
    'package.json "files" still lists the removed no-op app.plugin.js'
  );
  assert.ok(
    !fs.existsSync(path.join(root, 'app.plugin.js')),
    'app.plugin.js was removed in 2.0.0; delete it or restore the "files" entry'
  );
});

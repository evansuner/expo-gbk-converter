# expo-gbk-converter

An Expo native module to decode GBK/GB18030 encoded text from base64 strings. This is particularly useful for parsing Chinese encoded files (like CSV exports from Alipay, WeChat, etc.) in React Native/Expo applications.

## Installation

```bash
npx expo install expo-gbk-converter
```

Or using npm/yarn:

```bash
npm install expo-gbk-converter
# or
yarn add expo-gbk-converter
```

## Requirements

- Expo SDK 53+
- iOS 15.1+
- Android minSdkVersion 24+
- Web: a browser with atob and TextDecoder support for GB18030.

> **Upgrading from 1.x:** 2.0.0 migrates the Android build to `expo-module-gradle-plugin`, which `expo-modules-core` ships from Expo SDK 53 onward. That moves the supported floor from SDK 51 to SDK 53. The bundled `app.plugin.js` was a no-op and has been removed — if your `app.json` or `app.config.js` lists `expo-gbk-converter` in `plugins`, delete that entry or `expo prebuild` will fail.

On iOS and Android, this package requires a development build containing the native module; it does not run in Expo Go. Rebuild your app after installation using npx expo run:ios or npx expo run:android, or use an EAS development build.

## Usage

The examples use the legacy FileSystem API on current Expo SDKs. On older SDKs without the legacy entry point, import from expo-file-system instead. Install expo-file-system separately with npx expo install expo-file-system.

```typescript
import { decodeGBK } from 'expo-gbk-converter';
import * as FileSystem from 'expo-file-system/legacy';

// Read a GBK encoded file as base64
const base64Content = await FileSystem.readAsStringAsync(fileUri, {
  encoding: FileSystem.EncodingType.Base64,
});

// Decode GBK to UTF-8 string
const utf8Text = await decodeGBK(base64Content);

console.log(utf8Text); // Now you have the readable Chinese text
```

## API

### `decodeGBK(base64: string): Promise<string>`

Decodes a GBK/GB18030 encoded base64 string to UTF-8 text.

**Parameters:**

- `base64` (string): Base64 encoded string of GBK/GB18030 data

**Returns:**

- `Promise<string>`: Decoded UTF-8 text

**Promise rejection:**

- Error if the base64 string is invalid
- On iOS and web, invalid GBK/GB18030 data rejects the promise. Android currently replaces malformed byte sequences with replacement characters.

## Platform Support

| Platform | Support |
| -------- | ------- |
| iOS      | ✅      |
| Android  | ✅      |
| Web      | ✅      |

> Web uses TextDecoder with fatal decoding: invalid byte sequences reject the promise. Pass raw base64, without a data URL prefix. The file-reading examples below target native apps; on web, obtain base64 from a browser file API.

## Use Cases

- Parsing Alipay (支付宝) bill exports
- Reading legacy Chinese encoded files
- Processing CSV files with GBK encoding

## Example: Parsing Alipay Bills

```typescript
import { decodeGBK } from 'expo-gbk-converter';
import * as FileSystem from 'expo-file-system/legacy';
import Papa from 'papaparse';

async function parseAlipayBill(fileUri: string) {
  // Read file as base64
  const base64 = await FileSystem.readAsStringAsync(fileUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Decode GBK to UTF-8
  const csvText = await decodeGBK(base64);

  // Normalize line endings
  const normalizedText = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Parse CSV
  const result = Papa.parse(normalizedText, {
    skipEmptyLines: true,
  });

  return result.data;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Run npm install, npm run lint, npm test, and npm run build before submitting changes. The tests cover the web decoder (Chinese text, four-byte GB18030 characters, CSV line endings, empty input, and invalid input) plus a manifest check that the version and native module names stay in sync across package.json, the Gradle build file, the podspec, and the Kotlin/Swift sources. Native behavior must also be verified in an iOS/Android development build.

## Author

Evan Sun <zhidong.s@outlook.com>

## Buy Me a Coffee

If you find this project helpful, consider buying me a coffee:  
[![Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://cdn.evanidea.cc/CDN/buy-me-a-coffee.jpg)

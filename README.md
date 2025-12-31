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

- Expo SDK 51+
- iOS 15.1+
- Android minSdkVersion 24+

## Usage

```typescript
import { decodeGBK } from 'expo-gbk-converter';
import * as FileSystem from 'expo-file-system';

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

**Throws:**

- Error if the base64 string is invalid
- Error if the data cannot be decoded as GBK/GB18030

## Platform Support

| Platform | Support |
| -------- | ------- |
| iOS      | ✅      |
| Android  | ✅      |
| Web      | ❌      |

> Note: Web platform is not supported because browsers don't have native GBK decoding support. Consider using a JavaScript-based decoder like `iconv-lite` for web.

## Use Cases

- Parsing Alipay (支付宝) bill exports
- Reading legacy Chinese encoded files
- Processing CSV files with GBK encoding

## Example: Parsing Alipay Bills

```typescript
import { decodeGBK } from 'expo-gbk-converter';
import * as FileSystem from 'expo-file-system';
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

## Author

Evan Sun <zhidong.s@outlook.com>

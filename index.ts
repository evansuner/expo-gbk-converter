import NativeModule from './src/ExpoGbkConverterModule';

export function decodeGBK(base64: string): Promise<string> {
  return NativeModule.decode(base64);
}

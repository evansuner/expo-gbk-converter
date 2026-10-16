import { requireNativeModule } from 'expo-modules-core';

export default requireNativeModule<{
  decode(base64: string): Promise<string>;
}>('ExpoGbkConverter');

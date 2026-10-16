export default {
  async decode(base64: string): Promise<string> {
    if (typeof base64 !== 'string') {
      throw new TypeError('Expected a base64 string');
    }
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder('gb18030', { fatal: true }).decode(bytes);
  },
};

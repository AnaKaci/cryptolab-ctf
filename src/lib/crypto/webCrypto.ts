const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToHex = (bytes: ArrayBuffer): string =>
  [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");

const bytesToBase64 = (bytes: Uint8Array): string => btoa(String.fromCharCode(...bytes));

const base64ToBytes = (value: string): Uint8Array =>
  Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

const toArrayBuffer = (bytes: Uint8Array): ArrayBuffer => {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return copy.buffer;
};

const getCrypto = (): Crypto => {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Web Crypto API is not available in this runtime.");
  }
  return globalThis.crypto;
};

export const sha256Hex = async (message: string): Promise<string> => {
  const digest = await getCrypto().subtle.digest("SHA-256", encoder.encode(message));
  return bytesToHex(digest);
};

export const hmacSha256Hex = async (message: string, key: string): Promise<string> => {
  const cryptoKey = await getCrypto().subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await getCrypto().subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return bytesToHex(signature);
};

export interface AesGcmResult {
  keyBase64: string;
  ivBase64: string;
  ciphertextBase64: string;
}

export const generateAesKeyBase64 = (): string => {
  const bytes = new Uint8Array(32);
  getCrypto().getRandomValues(bytes);
  return bytesToBase64(bytes);
};

export const aesGcmEncrypt = async (plaintext: string, keyBase64?: string): Promise<AesGcmResult> => {
  const crypto = getCrypto();
  const keyBytes = keyBase64 ? base64ToBytes(keyBase64) : base64ToBytes(generateAesKeyBase64());
  const iv = new Uint8Array(12);
  crypto.getRandomValues(iv);
  const key = await crypto.subtle.importKey("raw", toArrayBuffer(keyBytes), "AES-GCM", false, ["encrypt", "decrypt"]);
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv: toArrayBuffer(iv) }, key, encoder.encode(plaintext));

  return {
    keyBase64: bytesToBase64(keyBytes),
    ivBase64: bytesToBase64(iv),
    ciphertextBase64: bytesToBase64(new Uint8Array(ciphertext))
  };
};

export const aesGcmDecrypt = async (ciphertextBase64: string, keyBase64: string, ivBase64: string): Promise<string> => {
  const crypto = getCrypto();
  const key = await crypto.subtle.importKey("raw", toArrayBuffer(base64ToBytes(keyBase64)), "AES-GCM", false, ["decrypt"]);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: toArrayBuffer(base64ToBytes(ivBase64)) },
    key,
    toArrayBuffer(base64ToBytes(ciphertextBase64))
  );

  return decoder.decode(plaintext);
};

export const randomHex = (byteLength: number): string => {
  const bytes = new Uint8Array(byteLength);
  getCrypto().getRandomValues(bytes);
  return bytesToHex(toArrayBuffer(bytes));
};

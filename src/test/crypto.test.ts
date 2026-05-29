import { describe, expect, it } from "vitest";
import {
  affineDecrypt,
  affineEncrypt,
  caesarDecrypt,
  caesarEncrypt,
  vigenereDecrypt,
  vigenereEncrypt
} from "../lib/crypto/classical";
import { gcd, modInverse } from "../lib/crypto/math";
import {
  generateToyRsaKeys,
  rsaDecryptNumber,
  rsaEncryptNumber,
  rsaSignNumber,
  rsaVerifyNumber
} from "../lib/crypto/toyRsa";

describe("classical cipher helpers", () => {
  it("encrypts and decrypts Caesar cipher text with wrap-around", () => {
    expect(caesarEncrypt("XYZ abc!", 3)).toBe("ABC def!");
    expect(caesarDecrypt("ABC def!", 3)).toBe("XYZ abc!");
  });

  it("encrypts and decrypts Vigenere while skipping punctuation", () => {
    const ciphertext = vigenereEncrypt("ATTACK AT DAWN", "LEMON");
    expect(ciphertext).toBe("LXFOPV EF RNHR");
    expect(vigenereDecrypt(ciphertext, "LEMON")).toBe("ATTACK AT DAWN");
  });

  it("encrypts and decrypts affine cipher text", () => {
    const ciphertext = affineEncrypt("AFFINE CIPHER", 5, 8);
    expect(ciphertext).toBe("IHHWVC SWFRCP");
    expect(affineDecrypt(ciphertext, 5, 8)).toBe("AFFINE CIPHER");
  });
});

describe("modular arithmetic helpers", () => {
  it("computes gcd", () => {
    expect(gcd(252, 198)).toBe(18);
    expect(gcd(-42, 201)).toBe(3);
  });

  it("computes modular inverse when one exists", () => {
    expect(modInverse(7, 160)).toBe(23);
    expect(modInverse(13, 26)).toBeNull();
  });
});

describe("toy RSA helpers", () => {
  it("generates keys and round-trips a small message", () => {
    const keys = generateToyRsaKeys(11, 17, 7);
    const ciphertext = rsaEncryptNumber(42, keys.publicKey);
    expect(rsaDecryptNumber(ciphertext, keys.privateKey)).toBe(42);
  });

  it("signs and verifies a small message", () => {
    const keys = generateToyRsaKeys(11, 17, 7);
    const signature = rsaSignNumber(42, keys.privateKey);
    expect(rsaVerifyNumber(42, signature, keys.publicKey)).toBe(true);
    expect(rsaVerifyNumber(43, signature, keys.publicKey)).toBe(false);
  });
});

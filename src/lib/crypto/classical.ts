import { gcd, mod, modInverse } from "./math";

const A_CODE = "A".charCodeAt(0);
const Z_CODE = "Z".charCodeAt(0);
const LOWER_A_CODE = "a".charCodeAt(0);
const LOWER_Z_CODE = "z".charCodeAt(0);

const shiftLetter = (char: string, shift: number): string => {
  const code = char.charCodeAt(0);
  const isUpper = code >= A_CODE && code <= Z_CODE;
  const isLower = code >= LOWER_A_CODE && code <= LOWER_Z_CODE;

  if (!isUpper && !isLower) {
    return char;
  }

  const base = isUpper ? A_CODE : LOWER_A_CODE;
  return String.fromCharCode(base + mod(code - base + shift, 26));
};

export const caesarEncrypt = (text: string, shift: number): string =>
  [...text].map((char) => shiftLetter(char, shift)).join("");

export const caesarDecrypt = (ciphertext: string, shift: number): string => caesarEncrypt(ciphertext, -shift);

export const caesarBruteForce = (ciphertext: string): Array<{ shift: number; plaintext: string }> =>
  Array.from({ length: 26 }, (_, shift) => ({ shift, plaintext: caesarDecrypt(ciphertext, shift) }));

const keyShifts = (key: string): number[] => {
  const shifts = [...key.toUpperCase()]
    .filter((char) => char >= "A" && char <= "Z")
    .map((char) => char.charCodeAt(0) - A_CODE);

  return shifts.length > 0 ? shifts : [0];
};

const vigenereTransform = (text: string, key: string, direction: 1 | -1): string => {
  const shifts = keyShifts(key);
  let keyIndex = 0;

  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      const isLetter = (code >= A_CODE && code <= Z_CODE) || (code >= LOWER_A_CODE && code <= LOWER_Z_CODE);
      if (!isLetter) {
        return char;
      }

      const shifted = shiftLetter(char, shifts[keyIndex % shifts.length] * direction);
      keyIndex += 1;
      return shifted;
    })
    .join("");
};

export const vigenereEncrypt = (text: string, key: string): string => vigenereTransform(text, key, 1);

export const vigenereDecrypt = (ciphertext: string, key: string): string => vigenereTransform(ciphertext, key, -1);

export const validAffineMultipliers = Array.from({ length: 26 }, (_, value) => value).filter((value) => gcd(value, 26) === 1);

const affineTransform = (text: string, a: number, b: number, decrypt: boolean): string => {
  const inverse = decrypt ? modInverse(a, 26) : null;
  if (decrypt && inverse === null) {
    throw new Error("Affine multiplier must be coprime with 26.");
  }

  return [...text]
    .map((char) => {
      const code = char.charCodeAt(0);
      const isUpper = code >= A_CODE && code <= Z_CODE;
      const isLower = code >= LOWER_A_CODE && code <= LOWER_Z_CODE;
      if (!isUpper && !isLower) {
        return char;
      }

      const base = isUpper ? A_CODE : LOWER_A_CODE;
      const x = code - base;
      const transformed = decrypt ? mod((inverse as number) * (x - b), 26) : mod(a * x + b, 26);
      return String.fromCharCode(base + transformed);
    })
    .join("");
};

export const affineEncrypt = (text: string, a: number, b: number): string => {
  if (gcd(a, 26) !== 1) {
    throw new Error("Affine multiplier must be coprime with 26.");
  }
  return affineTransform(text, a, b, false);
};

export const affineDecrypt = (ciphertext: string, a: number, b: number): string => affineTransform(ciphertext, a, b, true);

export const affineBruteForce = (ciphertext: string): Array<{ a: number; b: number; plaintext: string }> =>
  validAffineMultipliers.flatMap((a) =>
    Array.from({ length: 26 }, (_, b) => ({ a, b, plaintext: affineDecrypt(ciphertext, a, b) }))
  );

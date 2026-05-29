import { gcd, isPrimeSmall, modInverse, modPow } from "./math";

export interface ToyRsaPublicKey {
  n: number;
  e: number;
}

export interface ToyRsaPrivateKey {
  n: number;
  d: number;
  phi: number;
  p: number;
  q: number;
}

export interface ToyRsaKeyPair {
  publicKey: ToyRsaPublicKey;
  privateKey: ToyRsaPrivateKey;
}

export const generateToyRsaKeys = (p: number, q: number, preferredE = 17): ToyRsaKeyPair => {
  if (!isPrimeSmall(p) || !isPrimeSmall(q) || p === q) {
    throw new Error("Toy RSA needs two different small prime numbers.");
  }

  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const candidateEs = [preferredE, 3, 5, 7, 11, 13, 17, 19, 23].filter((e, index, list) => list.indexOf(e) === index);
  const e = candidateEs.find((candidate) => candidate > 1 && candidate < phi && gcd(candidate, phi) === 1);

  if (e === undefined) {
    throw new Error("No public exponent is coprime with phi for these primes.");
  }

  const d = modInverse(e, phi);
  if (d === null) {
    throw new Error("Could not compute RSA private exponent.");
  }

  return {
    publicKey: { n, e },
    privateKey: { n, d, phi, p, q }
  };
};

export const rsaEncryptNumber = (message: number, key: ToyRsaPublicKey): number => {
  if (!Number.isInteger(message) || message < 0 || message >= key.n) {
    throw new Error("Toy RSA message must be an integer between 0 and n - 1.");
  }

  return modPow(message, key.e, key.n);
};

export const rsaDecryptNumber = (ciphertext: number, key: ToyRsaPrivateKey): number => modPow(ciphertext, key.d, key.n);

export const rsaSignNumber = (message: number, key: ToyRsaPrivateKey): number => {
  if (!Number.isInteger(message) || message < 0 || message >= key.n) {
    throw new Error("Toy RSA signature message must be an integer between 0 and n - 1.");
  }

  return modPow(message, key.d, key.n);
};

export const rsaVerifyNumber = (message: number, signature: number, key: ToyRsaPublicKey): boolean =>
  modPow(signature, key.e, key.n) === message;

export const factorSmallN = (n: number): { p: number; q: number } | null => {
  for (let factor = 2; factor * factor <= n; factor += 1) {
    if (n % factor === 0) {
      return { p: factor, q: n / factor };
    }
  }

  return null;
};

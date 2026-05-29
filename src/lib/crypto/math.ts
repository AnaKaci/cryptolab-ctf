export const mod = (value: number, modulus: number): number => ((value % modulus) + modulus) % modulus;

export const gcd = (a: number, b: number): number => {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const next = x % y;
    x = y;
    y = next;
  }

  return x;
};

export interface ExtendedGcdResult {
  gcd: number;
  x: number;
  y: number;
  steps: Array<{ a: number; b: number; quotient: number; remainder: number }>;
}

export const extendedGcd = (a: number, b: number): ExtendedGcdResult => {
  let oldR = a;
  let r = b;
  let oldS = 1;
  let s = 0;
  let oldT = 0;
  let t = 1;
  const steps: ExtendedGcdResult["steps"] = [];

  while (r !== 0) {
    const quotient = Math.trunc(oldR / r);
    steps.push({ a: oldR, b: r, quotient, remainder: oldR - quotient * r });

    [oldR, r] = [r, oldR - quotient * r];
    [oldS, s] = [s, oldS - quotient * s];
    [oldT, t] = [t, oldT - quotient * t];
  }

  return { gcd: Math.abs(oldR), x: oldS, y: oldT, steps };
};

export const modInverse = (value: number, modulus: number): number | null => {
  const result = extendedGcd(mod(value, modulus), modulus);
  if (result.gcd !== 1) {
    return null;
  }

  return mod(result.x, modulus);
};

export const modPow = (base: number, exponent: number, modulus: number): number => {
  if (modulus === 1) {
    return 0;
  }

  let result = 1n;
  let currentBase = BigInt(mod(base, modulus));
  let currentExponent = BigInt(exponent);
  const bigModulus = BigInt(modulus);

  // Square-and-multiply keeps modular exponentiation teachable and efficient.
  while (currentExponent > 0n) {
    if (currentExponent % 2n === 1n) {
      result = (result * currentBase) % bigModulus;
    }
    currentBase = (currentBase * currentBase) % bigModulus;
    currentExponent /= 2n;
  }

  return Number(result);
};

export const isPrimeSmall = (value: number): boolean => {
  if (!Number.isInteger(value) || value < 2) {
    return false;
  }
  if (value === 2) {
    return true;
  }
  if (value % 2 === 0) {
    return false;
  }

  for (let factor = 3; factor * factor <= value; factor += 2) {
    if (value % factor === 0) {
      return false;
    }
  }

  return true;
};

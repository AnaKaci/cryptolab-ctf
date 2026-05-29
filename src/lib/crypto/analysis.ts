import { affineBruteForce, caesarBruteForce } from "./classical";
import { gcd, mod, modPow } from "./math";

export const letterFrequencies = (text: string): Array<{ letter: string; count: number; percent: number }> => {
  const letters = [...text.toUpperCase()].filter((char) => char >= "A" && char <= "Z");
  const total = Math.max(letters.length, 1);

  return Array.from({ length: 26 }, (_, index) => {
    const letter = String.fromCharCode("A".charCodeAt(0) + index);
    const count = letters.filter((char) => char === letter).length;
    return { letter, count, percent: (count / total) * 100 };
  });
};

export const indexOfCoincidence = (text: string): number => {
  const letters = [...text.toUpperCase()].filter((char) => char >= "A" && char <= "Z");
  const n = letters.length;
  if (n < 2) {
    return 0;
  }

  const counts = letterFrequencies(letters.join("")).map((entry) => entry.count);
  const numerator = counts.reduce((sum, count) => sum + count * (count - 1), 0);
  return numerator / (n * (n - 1));
};

export const estimateVigenereKeyLengths = (ciphertext: string, maxLength = 12): Array<{ keyLength: number; score: number }> => {
  const letters = [...ciphertext.toUpperCase()].filter((char) => char >= "A" && char <= "Z");

  return Array.from({ length: maxLength }, (_, index) => {
    const keyLength = index + 1;
    const groups = Array.from({ length: keyLength }, (_, groupIndex) =>
      letters.filter((_, letterIndex) => letterIndex % keyLength === groupIndex).join("")
    );
    const score = groups.reduce((sum, group) => sum + indexOfCoincidence(group), 0) / groups.length;
    return { keyLength, score };
  }).sort((a, b) => b.score - a.score);
};

export const kasiskiRepeats = (ciphertext: string, sequenceLength = 3): Array<{ sequence: string; positions: number[]; gaps: number[] }> => {
  const letters = [...ciphertext.toUpperCase()].filter((char) => char >= "A" && char <= "Z").join("");
  const seen = new Map<string, number[]>();

  for (let index = 0; index <= letters.length - sequenceLength; index += 1) {
    const sequence = letters.slice(index, index + sequenceLength);
    seen.set(sequence, [...(seen.get(sequence) ?? []), index]);
  }

  return [...seen.entries()]
    .filter(([, positions]) => positions.length > 1)
    .map(([sequence, positions]) => ({
      sequence,
      positions,
      gaps: positions.slice(1).map((position, index) => position - positions[index])
    }))
    .sort((a, b) => b.positions.length - a.positions.length)
    .slice(0, 8);
};

export const avalancheBits = (leftHex: string, rightHex: string): { changed: number; total: number; percent: number } => {
  const length = Math.min(leftHex.length, rightHex.length);
  let changed = 0;
  const total = length * 4;

  for (let index = 0; index < length; index += 1) {
    const leftNibble = Number.parseInt(leftHex[index], 16);
    const rightNibble = Number.parseInt(rightHex[index], 16);
    const xor = leftNibble ^ rightNibble;
    changed += xor.toString(2).split("1").length - 1;
  }

  return { changed, total, percent: total === 0 ? 0 : (changed / total) * 100 };
};

export const toyHash = (text: string): number =>
  [...text].reduce((state, char) => mod(state * 31 + char.charCodeAt(0), 256), 17);

export const findToyHashCollision = (seed: string): { left: string; right: string; hash: number } => {
  const target = toyHash(seed);
  for (let suffix = 0; suffix < 10000; suffix += 1) {
    const candidate = `${seed}-${suffix}`;
    if (candidate !== seed && toyHash(candidate) === target) {
      return { left: seed, right: candidate, hash: target };
    }
  }

  return { left: seed, right: `${seed}-demo`, hash: target };
};

export const safeCaesarSolver = caesarBruteForce;

export const safeAffineSolver = affineBruteForce;

export const dhSharedSecret = (base: number, prime: number, privateA: number, privateB: number) => {
  const publicA = modPow(base, privateA, prime);
  const publicB = modPow(base, privateB, prime);
  const secretA = modPow(publicB, privateA, prime);
  const secretB = modPow(publicA, privateB, prime);
  return { publicA, publicB, secretA, secretB, matches: secretA === secretB };
};

export const coprimeNumbersBelow = (value: number): number[] =>
  Array.from({ length: Math.max(value - 1, 0) }, (_, index) => index + 1).filter((candidate) => gcd(candidate, value) === 1);

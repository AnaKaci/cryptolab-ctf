import type { Challenge } from "../types/models";

export const challenges: Challenge[] = [
  {
    id: "caesar-orbit",
    title: "Decode the Rotating Gate",
    category: "Classical",
    difficulty: "Intro",
    points: 50,
    status: "available",
    prompt: "Ciphertext: FUBSWR_ODE_FKLIW. It was encrypted with a Caesar shift of 3. Submit the flag.",
    hints: [
      { id: "h1", order: 1, text: "A Caesar shift of 3 means encryption moved letters forward by 3." },
      { id: "h2", order: 2, text: "Decrypt by moving each letter backward by 3." }
    ],
    flag: "CRYPTO_LAB_SHIFT",
    solution: "F->C, U->R, B->Y, and so on. The plaintext is CRYPTO_LAB_SHIFT.",
    talkingPoints: ["Small keyspaces are easy to exhaust.", "Punctuation and underscores were not encrypted."]
  },
  {
    id: "vigenere-microkey",
    title: "Tiny Keyword Trail",
    category: "Classical",
    difficulty: "Easy",
    points: 100,
    status: "available",
    prompt: "Ciphertext: ROVGAB_GKB. The Vigenere key is KEY. Submit the recovered flag.",
    hints: [
      { id: "h1", order: 1, text: "Repeat KEY over the letters only." },
      { id: "h2", order: 2, text: "K=10, E=4, Y=24; subtract these shifts while decrypting." }
    ],
    flag: "HELLO_CTF",
    solution: "Apply Vigenere decryption with KEY, skipping the underscore, to recover HELLO_CTF.",
    talkingPoints: ["Key alignment matters.", "Repeated short keys create patterns."]
  },
  {
    id: "ecb-patterns",
    title: "Pattern Leak",
    category: "Modes",
    difficulty: "Easy",
    points: 75,
    status: "available",
    prompt: "A block-mode diagram shows identical plaintext blocks producing identical ciphertext blocks. Which mode is being demonstrated? Submit the mode name.",
    hints: [
      { id: "h1", order: 1, text: "The warning example is deterministic for each block." },
      { id: "h2", order: 2, text: "It is the mode often illustrated with visible image patterns." }
    ],
    flag: "ECB",
    solution: "ECB encrypts equal plaintext blocks into equal ciphertext blocks under the same key.",
    talkingPoints: ["Encryption can still leak structure.", "Modes are part of a secure design."]
  },
  {
    id: "rsa-small-n",
    title: "Factor the Mini Modulus",
    category: "Asymmetric",
    difficulty: "Medium",
    points: 150,
    status: "available",
    prompt: "Toy RSA gives n=187 and e=7. Factor n and compute phi. Submit p*q_phi, for example 3*5_8.",
    hints: [
      { id: "h1", order: 1, text: "Try small prime divisors of 187." },
      { id: "h2", order: 2, text: "187 = 11 * 17 and phi = (p-1)(q-1)." }
    ],
    flag: "11*17_160",
    solution: "187 factors as 11 and 17, so phi = 10 * 16 = 160.",
    talkingPoints: ["Tiny RSA is intentionally factorable.", "Real RSA uses much larger primes and padding."]
  },
  {
    id: "hash-avalanche",
    title: "Avalanche Watch",
    category: "Hashing",
    difficulty: "Intro",
    points: 75,
    status: "available",
    prompt: "Two SHA-256 digests for messages differing by one character look unrelated. What property does this demonstrate?",
    hints: [
      { id: "h1", order: 1, text: "The effect describes many output bits changing after a tiny input change." },
      { id: "h2", order: 2, text: "It is named after a sudden cascade." }
    ],
    flag: "AVALANCHE",
    solution: "The avalanche effect is the desired behavior where small input changes flip many digest bits.",
    talkingPoints: ["Hashes are not encryption.", "Avalanche does not mean password hashing is solved."]
  },
  {
    id: "hmac-check",
    title: "Keyed Integrity",
    category: "Integrity",
    difficulty: "Easy",
    points: 100,
    status: "available",
    prompt: "For message CLASS and key LAB, the correct HMAC concept is based on a secret key plus a message. Submit the primitive name.",
    hints: [
      { id: "h1", order: 1, text: "It is not just SHA-256(message)." },
      { id: "h2", order: 2, text: "The acronym starts with H and ends with MAC." }
    ],
    flag: "HMAC",
    solution: "HMAC uses a shared secret key to authenticate a message.",
    talkingPoints: ["HMAC authenticates; a plain hash does not.", "The key must remain secret."]
  },
  {
    id: "dh-secret",
    title: "Shared Secret Handshake",
    category: "Asymmetric",
    difficulty: "Medium",
    points: 150,
    status: "available",
    prompt: "Toy DH uses p=23, g=5, Alice private a=6, Bob private b=15. Submit the shared secret number.",
    hints: [
      { id: "h1", order: 1, text: "Compute A = 5^6 mod 23 and B = 5^15 mod 23." },
      { id: "h2", order: 2, text: "Then compute B^6 mod 23 or A^15 mod 23." }
    ],
    flag: "2",
    solution: "A=8, B=19, and the shared secret is 2.",
    talkingPoints: ["The private values were not sent.", "Authentication is still needed in real protocols."]
  },
  {
    id: "legacy-warning",
    title: "Legacy Crypto Triage",
    category: "Safety",
    difficulty: "Easy",
    points: 100,
    status: "available",
    prompt: "Which label should new designs apply to MD5, SHA-1, and DES in this classroom app?",
    hints: [
      { id: "h1", order: 1, text: "They are shown for history and migration decisions." },
      { id: "h2", order: 2, text: "The strictest shared status among these is not secure or educational-only." }
    ],
    flag: "BROKEN",
    solution: "MD5 and SHA-1 are broken for collision resistance; DES is obsolete. The challenge expects BROKEN.",
    talkingPoints: ["Deprecation language should be visible.", "Do not build new systems on legacy primitives."]
  },
  {
    id: "gcm-nonce",
    title: "Nonce Discipline",
    category: "Symmetric",
    difficulty: "Medium",
    points: 125,
    status: "available",
    prompt: "AES-GCM under the same key needs a fresh value for every encryption. Submit the required behavior for the nonce.",
    hints: [
      { id: "h1", order: 1, text: "The nonce is usually stored with the ciphertext." },
      { id: "h2", order: 2, text: "The important rule is that it must not repeat with the same key." }
    ],
    flag: "UNIQUE",
    solution: "AES-GCM nonces must be unique for a given key. Random 96-bit IVs are commonly used.",
    talkingPoints: ["Nonces are not necessarily secret.", "Reuse can break confidentiality and integrity."]
  }
];

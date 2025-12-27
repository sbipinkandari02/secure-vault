const encoder = new TextEncoder();
const decoder = new TextDecoder();

/**
 * Converts Uint8Array to Base64
 */
function uint8ArrayToBase64(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

/**
 * Converts Base64 to Uint8Array
 */
function base64ToUint8Array(base64) {
  return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

/**
 * Derive AES-GCM 256-bit key from master password + salt
 * @param {string} password
 * @param {Uint8Array} salt
 * @param {number} iterations optional, default 100000
 * @returns {Promise<CryptoKey>}
 */
export async function deriveKey(password, salt, iterations = 100000) {
  if (!password || !salt) throw new Error("Password and salt are required");

  const baseKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  const cryptoKey = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false, // non-extractable
    ["encrypt", "decrypt"]
  );

  return cryptoKey;
}

/**
 * Encrypts vault data with AES-GCM
 * @param {CryptoKey} cryptoKey
 * @param {any} data
 * @returns {Promise<{iv: string, ciphertext: string}>}
 */
export async function encryptVault(cryptoKey, data) {
  if (!(cryptoKey instanceof CryptoKey)) throw new Error("Invalid CryptoKey");

  try {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = encoder.encode(JSON.stringify(data));

    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encoded
    );

    return {
      iv: uint8ArrayToBase64(iv),
      ciphertext: uint8ArrayToBase64(new Uint8Array(encrypted)),
    };
  } catch (err) {
    console.error("Encryption failed", err);
    throw new Error("Failed to encrypt vault");
  }
}

/**
 * Decrypts vault data with AES-GCM
 * @param {CryptoKey} cryptoKey
 * @param {string} ivBase64
 * @param {string} ciphertextBase64
 * @returns {Promise<any>} decrypted object
 */
export async function decryptVault(cryptoKey, ivBase64, ciphertextBase64) {
  try {
    const iv = base64ToUint8Array(ivBase64);
    const ciphertext = base64ToUint8Array(ciphertextBase64);

    const decrypted = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      ciphertext
    );

    return JSON.parse(decoder.decode(decrypted));
  } catch (err) {
    console.error("Decryption failed", err);
    throw new Error("Failed to decrypt vault. Wrong password or corrupted data.");
  }
}

/**
 * Generate random salt for key derivation
 * @param {number} length optional, default 16 bytes
 * @returns {Uint8Array}
 */
export function generateSalt(length = 16) {
  return crypto.getRandomValues(new Uint8Array(length));
}

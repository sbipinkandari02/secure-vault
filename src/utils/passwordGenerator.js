export function generatePassword(length = 16) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);

  return Array.from(array, (x) => charset[x % charset.length]).join("");
}

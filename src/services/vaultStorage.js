const VAULT_KEY = "secure_vault";

export function saveEncryptedVault({ salt, iv, ciphertext }) {
  const vaultData = { salt, iv, ciphertext };
  localStorage.setItem(VAULT_KEY, JSON.stringify(vaultData));
}

export function loadEncryptedVault() {
  const vault = localStorage.getItem(VAULT_KEY);
  return vault ? JSON.parse(vault) : null;
}

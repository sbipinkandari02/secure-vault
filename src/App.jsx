import { useState, Suspense, lazy } from "react";
import { deriveKey, decryptVault, generateSalt } from "./utils/crypto";
import { loadEncryptedVault } from "./services/vaultStorage";
import CustomLoader from "./components/CustomLoader";

// Lazy load components
const LockScreen = lazy(() => import("./pages/LockScreen"));
const Vault = lazy(() => import("./pages/Vault"));

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [cryptoKey, setCryptoKey] = useState(null);
  const [salt, setSalt] = useState(null);
  const [secrets, setSecrets] = useState([]);

  const handleUnlock = async (masterPassword) => {
    try {
      const vault = loadEncryptedVault();

      if (!vault) {
        const newSalt = generateSalt();
        const newKey = await deriveKey(masterPassword, newSalt);
        setSecrets([]);
        setCryptoKey(newKey);
        setSalt(newSalt);
        setUnlocked(true);
        return;
      }

      const storedSalt = Uint8Array.from(atob(vault.salt), (c) => c.charCodeAt(0));
      const key = await deriveKey(masterPassword, storedSalt);
      const decryptedSecrets = await decryptVault(key, vault.iv, vault.ciphertext);

      setSecrets(Array.isArray(decryptedSecrets) ? decryptedSecrets : []);
      setCryptoKey(key);
      setSalt(storedSalt);
      setUnlocked(true);
    } catch (err) {
      console.error(err);
      throw new Error("Invalid master password or corrupted vault");
    }
  };

  return (
    <Suspense fallback={<CustomLoader />}>
      {!unlocked ? (
        <LockScreen onUnlock={handleUnlock} />
      ) : (
        <Vault secrets={secrets} setSecrets={setSecrets} cryptoKey={cryptoKey} salt={salt} />
      )}
    </Suspense>
  );
}

export default App;

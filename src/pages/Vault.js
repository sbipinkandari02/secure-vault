import { useState } from "react";
import CustomTable from "../components/CustomTable";
import CustomButton from "../components/CustomButton";
import { encryptVault } from "../utils/crypto";
import { saveEncryptedVault } from "../services/vaultStorage";
import { AiFillUnlock } from "react-icons/ai";
import "../styles/Vault.css";
import { lazy, Suspense } from "react";
import CustomLoader from "../components/CustomLoader";

const CustomModal = lazy(() => import("../components/CustomModal"));

export default function Vault({ secrets = [], setSecrets, cryptoKey, salt }) {
  const [showModal, setShowModal] = useState(false);

  const persist = async (updatedSecrets) => {
    if (!cryptoKey) return;
    const encrypted = await encryptVault(cryptoKey, updatedSecrets);
    saveEncryptedVault({
      salt: btoa(String.fromCharCode(...salt)),
      ...encrypted,
    });
  };

  const addSecret = (secret) => {
    const updated = [...secrets, secret];
    setSecrets(updated);
    persist(updated);
    setShowModal(false);
  };

  const deleteSecret = (index) => {
    const updated = secrets.filter((_, i) => i !== index);
    setSecrets(updated);
    persist(updated);
  };

  return (
    <div className="vault-page">
      <div className="vault-card">
        <div className="vault-header">
          <AiFillUnlock className="vault-icon" />
          <h2>Secret Vault List</h2>
        </div>

        {/* Button container aligned left */}
        <div className="button-container">
          <CustomButton onClick={() => setShowModal(true)}>Create</CustomButton>
        </div>

        <CustomTable
          secrets={Array.isArray(secrets) ? secrets : []}
          onDelete={deleteSecret}
        />
      </div>

      {showModal && (
        <Suspense fallback={<CustomLoader />}>
          <CustomModal onSave={addSecret} onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}

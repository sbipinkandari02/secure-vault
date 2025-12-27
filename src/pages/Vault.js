import { useState, lazy, Suspense, useCallback, useMemo } from "react";
import CustomTable from "../components/CustomTable";
import CustomButton from "../components/CustomButton";
import { encryptVault } from "../utils/crypto";
import { saveEncryptedVault } from "../services/vaultStorage";
import { AiFillUnlock } from "react-icons/ai";
import "../styles/Vault.css";
import CustomLoader from "../components/CustomLoader";
import debounce from "lodash.debounce";

const CustomModal = lazy(() => import("../components/CustomModal"));

export default function Vault({ secrets = [], setSecrets, cryptoKey, salt }) {
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // Immediate input
  const [search, setSearch] = useState(""); // Debounced search

   // Debounce search (300ms)
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setSearch(value);
      }, 300),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

const persist = useCallback(
    async (updated) => {
      if (!cryptoKey) return;

      const encrypted = await encryptVault(cryptoKey, updated);
      saveEncryptedVault({
        salt: btoa(String.fromCharCode(...salt)),
        ...encrypted,
      });
    },
    [cryptoKey, salt]
  );

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

// Filter secrets based on debounced search
  const filteredSecrets = useMemo(() => {
    if (!search.trim()) return secrets;
    const q = search.toLowerCase();
    return secrets.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q)
    );
  }, [search, secrets]);

  return (
    <div className="vault-page">
      <div className="vault-card">
        <div className="vault-header">
          <AiFillUnlock className="vault-icon" />
          <h2>Secret Vault List</h2>
        </div>
        {/* Top controls: Search + Create */}
        <div className="vault-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or username..."
            value={searchInput}
            onChange={handleSearchChange}
          />
          <CustomButton onClick={() => setShowModal(true)}>Create</CustomButton>
        </div>

        <CustomTable secrets={filteredSecrets} onDelete={deleteSecret} />
      </div>

      {showModal && (
        <Suspense fallback={<CustomLoader />}>
          <CustomModal onSave={addSecret} onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}

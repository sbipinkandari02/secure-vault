import { useState } from "react";
import "../styles/LockScreen.css";
import { AiFillLock } from "react-icons/ai";

export default function LockScreen({ onUnlock }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUnlock(password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="lock-container">
      <div className="lock-card">
        <h2>
          <AiFillLock />
          Secret Vault
        </h2>
        <form onSubmit={handleSubmit} className="lock-form">
          <input
            type="password"
            placeholder="Enter master password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Unlock</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}

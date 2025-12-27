import { useState } from "react";
import Modal from "react-modal";
import "../styles/Modal.css";
import { generatePassword } from "../utils/passwordGenerator";
import CustomButton from "../components/CustomButton";


Modal.setAppElement("#root");

export default function CustomModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", username: "", password: "", notes: "" });
  const [errors, setErrors] = useState({});

  const handleGeneratePassword = () => {
    setForm((prev) => ({
      ...prev,
      password: generatePassword(16),
    }));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSave({ ...form, createdAt: Date.now() });
      setForm({ name: "", username: "", password: "", notes: "" });
    }
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel="Create Secret"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2>Create Secret</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name*"
          value={form.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input
          name="username"
          placeholder="Username*"
          value={form.username}
          onChange={handleChange}
        />
        {errors.username && <p className="error-text">{errors.username}</p>}
        <div className="password-row">
          <input
            type="text"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <CustomButton
            type="button"
            children="save-button"
            onClick={handleGeneratePassword}
          >
            Generate
          </CustomButton>
        </div>
        {errors.password && <p className="error-text">{errors.password}</p>}

        <textarea
          name="notes"
          placeholder="Notes (optional)"
          value={form.notes}
          onChange={handleChange}
        />

        <div className="modal-buttons">
          <CustomButton type="submit" className="save-button">
            Save
          </CustomButton>
          <CustomButton type="button" className="cancel-button" onClick={onClose}>
            Cancel
          </CustomButton>
        </div>
      </form>
    </Modal>
  );
}

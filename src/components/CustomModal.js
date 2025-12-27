import { useState } from "react";
import Modal from "react-modal";
import "../styles/Modal.css";

Modal.setAppElement("#root");

export default function CustomModal({ onSave, onClose }) {
  const [form, setForm] = useState({ name: "", username: "", password: "", notes: "" });
  const [errors, setErrors] = useState({});

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
        <input name="name" placeholder="Name*" value={form.name} onChange={handleChange} />
        {errors.name && <p className="error-text">{errors.name}</p>}

        <input name="username" placeholder="Username*" value={form.username} onChange={handleChange} />
        {errors.username && <p className="error-text">{errors.username}</p>}

        <input type="password" name="password" placeholder="Password*" value={form.password} onChange={handleChange} />
        {errors.password && <p className="error-text">{errors.password}</p>}

        <textarea name="notes" placeholder="Notes (optional)" value={form.notes} onChange={handleChange} />

        <div className="modal-buttons">
          <button type="submit" className="save-button">Save</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

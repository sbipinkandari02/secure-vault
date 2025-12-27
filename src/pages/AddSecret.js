import { useState } from "react";

export default function AddSecret({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
    notes: "",
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.username || !form.password) {
      alert("Name, Username and Password are required");
      return;
    }

    onAdd({
      name: form.name,
      username: form.username,
      password: form.password,
      notes: form.notes,
      createdAt: Date.now(),
    });

    // Clear sensitive fields from memory ASAP
    setForm({
      name: "",
      username: "",
      password: "",
      notes: "",
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add New Secret</h3>

      <input
        name="name"
        placeholder="Service Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes (optional)"
        value={form.notes}
        onChange={handleChange}
      />

      <button type="submit">Save Secret</button>
    </form>
  );
}

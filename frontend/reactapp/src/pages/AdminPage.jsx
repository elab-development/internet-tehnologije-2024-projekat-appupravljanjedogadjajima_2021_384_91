import { useState } from "react";
import "./AdminPage.css";

export default function AdminPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Ispiti", color: "#ef4444" },
    { id: 2, name: "Predavanja", color: "#3b82f6" },
    { id: 3, name: "Projekti", color: "#22c55e" },
  ]);

  const [form, setForm] = useState({ name: "", color: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name.trim() === "") return;

    const newCategory = {
      id: Math.max(0, ...categories.map((c) => c.id)) + 1,
      name: form.name,
      color: form.color || "#6b7280",
    };

    setCategories([...categories, newCategory]);
    setForm({ name: "", color: "" });
  };

  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  return (
    <div className="admin-page">
      <h2>Upravljanje kategorijama</h2>

      <form onSubmit={handleSubmit} className="category-form">
        <input
          type="text"
          placeholder="Naziv kategorije"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />
        <button type="submit" className="add-btn">Dodaj</button>
      </form>

      <ul className="category-list">
        {categories.map((c) => (
          <li key={c.id} style={{ borderLeft: `6px solid ${c.color}` }}>
            <span>{c.name}</span>
            <button className="delete-btn" onClick={() => handleDelete(c.id)}>
              Obriši
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

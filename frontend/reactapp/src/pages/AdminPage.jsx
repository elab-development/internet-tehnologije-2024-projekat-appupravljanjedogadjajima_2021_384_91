import { useEffect, useState } from "react";
import "./AdminPage.css";

export default function AdminPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", color: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:8000/api/categories", {
          headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Greška pri učitavanju kategorija.");

        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim() === "") return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role !== "admin") {
      alert("Samo admini mogu dodavati kategorije.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          color: form.color || "#6b7280",
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Greška pri dodavanju kategorije.");

      setCategories([...categories, data.category]);
      setForm({ name: "", color: "" });
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Da li ste sigurni da želite da obrišete ovu kategoriju?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.role !== "admin") {
      alert("Samo admini mogu brisati kategorije.");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Greška pri brisanju kategorije.");

      setCategories(categories.filter((c) => c.id !== id));
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Učitavanje kategorija...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

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

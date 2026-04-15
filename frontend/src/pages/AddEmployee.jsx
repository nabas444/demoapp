import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export default function AddEmployee() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState({ type: "idle", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "loading", message: "Saving…" });
    try {
      const res = await fetch(`${API_URL}/add-employee`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || data?.error || "Request failed");

      setStatus({
        type: "success",
        message: `Employee created (id: ${data.employeeId})`,
      });
      setForm({ first_name: "", last_name: "", email: "", password: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    }
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Add Employee</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: "0.75rem", maxWidth: "320px" }}
      >
        <label>
          First name
          <input
            name="first_name"
            type="text"
            placeholder="Jane"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Last name
          <input
            name="last_name"
            type="text"
            placeholder="Doe"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit" disabled={status.type === "loading"}>
          {status.type === "loading" ? "Saving…" : "Save"}
        </button>
      </form>

      {status.message && (
        <p
          style={{
            marginTop: "1rem",
            color: status.type === "error" ? "#ff8c8c" : "#8cf5c3",
          }}
        >
          {status.message}
        </p>
      )}
    </main>
  );
}

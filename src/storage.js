// src/storage.js
// Minimal async storage adapter used by the app.
// Default implementation: localStorage-backed functions that match the
// async API used by src/App.jsx (get/set/delete/list).
//
// To swap in a network-backed adapter, replace `adapter` with an object
// implementing the same async methods (get/set/delete/list). A commented
// fetch-backed example is included below.

const localAdapter = {
  async get(key, shared = false) {
    const raw = localStorage.getItem(`${shared ? "shared" : "personal"}:${key}`);
    if (raw === null) throw new Error("not found");
    return { key, value: raw, shared: !!shared };
  },
  async set(key, value, shared = false) {
    localStorage.setItem(`${shared ? "shared" : "personal"}:${key}`, value);
    return { key, value, shared: !!shared };
  },
  async delete(key, shared = false) {
    localStorage.removeItem(`${shared ? "shared" : "personal"}:${key}`);
    return { key, deleted: true, shared: !!shared };
  },
  async list(prefix = "", shared = false) {
    const p = `${shared ? "shared" : "personal"}:${prefix || ""}`;
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(p))
      .map((k) => k.slice(p.length));
    return { keys, prefix, shared: !!shared };
  },
};

// Example network adapter (uncomment and customize to use a backend API):
/*
const baseUrl = process.env.STORAGE_API_BASE || "https://api.example.com";
const fetchAdapter = {
  async get(key, shared = false) {
    const res = await fetch(`${baseUrl}/storage/get?key=${encodeURIComponent(key)}&shared=${shared}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("not found");
    return res.json();
  },
  async set(key, value, shared = false) {
    const res = await fetch(`${baseUrl}/storage/set`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value, shared }),
    });
    if (!res.ok) throw new Error("set failed");
    return res.json();
  },
  async delete(key, shared = false) {
    const res = await fetch(`${baseUrl}/storage/delete`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, shared }),
    });
    if (!res.ok) throw new Error("delete failed");
    return res.json();
  },
  async list(prefix = "", shared = false) {
    const res = await fetch(`${baseUrl}/storage/list?prefix=${encodeURIComponent(prefix)}&shared=${shared}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("list failed");
    return res.json();
  },
};
*/

// Choose the default adapter here. Replace `localAdapter` with `fetchAdapter`
// after you customize the network adapter if you want to use a backend.
const adapter = localAdapter;

export default adapter;

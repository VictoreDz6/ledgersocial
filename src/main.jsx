import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// App.jsx uses `window.storage`, which is only provided natively inside the
// Claude.ai artifact runtime. This stub lets the app run locally during
// development using localStorage instead. Replace with a real backend call
// before shipping to production.
if (!window.storage) {
  window.storage = {
    async get(key, shared) {
      const raw = localStorage.getItem(`${shared ? "shared" : "personal"}:${key}`);
      if (raw === null) throw new Error("not found");
      return { key, value: raw, shared: !!shared };
    },
    async set(key, value, shared) {
      localStorage.setItem(`${shared ? "shared" : "personal"}:${key}`, value);
      return { key, value, shared: !!shared };
    },
    async delete(key, shared) {
      localStorage.removeItem(`${shared ? "shared" : "personal"}:${key}`);
      return { key, deleted: true, shared: !!shared };
    },
    async list(prefix, shared) {
      const p = `${shared ? "shared" : "personal"}:${prefix || ""}`;
      const keys = Object.keys(localStorage).filter((k) => k.startsWith(p)).map((k) => k.slice(p.length));
      return { keys, prefix, shared: !!shared };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

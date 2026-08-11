import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import storage from "./storage.js";

// App.jsx expects window.storage. If an environment already provides one (e.g. hosted runtime),
// do not overwrite it. Otherwise install our local adapter.
if (!window.storage) {
  window.storage = storage;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

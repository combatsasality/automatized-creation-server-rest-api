import React from "react";

import ReactDOM from "react-dom/client";
import "@ant-design/v5-patch-for-react-19";
import "./i18n/config";
import "antd/dist/reset.css"; // обязательно!

import App from "./App";

const rootEl = document.getElementById("root");
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

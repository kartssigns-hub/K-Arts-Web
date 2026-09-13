import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import { initMonitoring } from "./lib/monitoring";
import App from "./App.tsx";
import AppErrorFallback from "./components/AppErrorFallback";
import "./index.css";

// Before the first render, so errors while rendering are captured too
initMonitoring();

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<AppErrorFallback />}>
    <App />
  </Sentry.ErrorBoundary>
);

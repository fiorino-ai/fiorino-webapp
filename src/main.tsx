import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RootScreen } from "./screens/RootScreen.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootScreen />
  </StrictMode>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Tableau from "./pages/Tableux/page.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import PropositionalLogicAnalyzer from "./pages/Home/page.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PropositionalLogicAnalyzer />}></Route>
        <Route path="/tableau" element={<Tableau />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

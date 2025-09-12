import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import NotFoundPage from "./components/NotFoundPageComponent";
import NavbarComponent from "./components/NavbarComponent";
import LoginPageComponent from "./components/LoginPageComponent";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <header>
          <NavbarComponent />
        </header>

        <main className="bg-m-black-sub">
          <Routes>
            <Route path="/auth/login" element={<LoginPageComponent />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer></footer>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

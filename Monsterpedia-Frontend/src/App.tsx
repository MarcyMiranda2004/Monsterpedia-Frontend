import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import NotFoundPage from "./components/NotFoundPageComponent";
import NavbarComponent from "./components/NavbarComponent";
import LoginPageComponent from "./components/LoginPageComponent";
import RegistrationPageComponent from "./components/RegistrationPageComponent";
import UserProfilePageComponent from "./components/UserProfilePageComponent";
import HomePageComponent from "./components/HomePageComponent";
import MonsterDetailsComponent from "./components/MonstersDetailsComponent";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <header>
          <NavbarComponent />
        </header>

        <main className="px-2">
          <Routes>
            <Route path="/auth/login" element={<LoginPageComponent />} />
            <Route
              path="/auth/register"
              element={<RegistrationPageComponent />}
            />
            <Route
              path="/users/user-profile/:userId"
              element={<UserProfilePageComponent />}
            />
            <Route path="/home" element={<HomePageComponent />} />
            <Route
              path="/monsters/:monsterId/details"
              element={<MonsterDetailsComponent />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer></footer>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

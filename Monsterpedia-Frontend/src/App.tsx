import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style/bootstrap.scss";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import NotFoundPage from "./components/Element/NotFoundPageComponent.tsx";
import NavbarComponent from "./components/Element/NavbarComponent.tsx";
import LoginPageComponent from "./components/Authentication/LoginPageComponent.tsx";
import RegistrationPageComponent from "./components/Authentication/RegistrationPageComponent.tsx";
import UserProfilePageComponent from "./components/PrincipalPage/UserProfilePageComponent.tsx";
import HomePageComponent from "./components/PrincipalPage/HomePageComponent.tsx";
import SearchPageComponent from "./components/PrincipalPage/SearchPageComponent.tsx";
import MonsterDetailsComponent from "./components/PrincipalPage/MonstersDetailsComponent.tsx";
import FooterComponent from "./components/Element/FooterComponent.tsx";

import BackOfficeHomeComponent from "./components/BackOffice/BackOfficeHomeComponent.tsx";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <header>
          <NavbarComponent />
        </header>

        <main className="pb-5">
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

            <Route path="/" element={<HomePageComponent />} />

            <Route path="/search" element={<SearchPageComponent />} />

            <Route
              path="/monsters/:monsterId/details"
              element={<MonsterDetailsComponent />}
            />

            <Route
              path="/backoffice/home"
              element={<BackOfficeHomeComponent />}
            />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="vw-100 mt-5 pt-5">
          <FooterComponent />
        </footer>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

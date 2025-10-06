import React, { useState, useContext, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button, Form, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import { PersonCircle, Search } from "react-bootstrap-icons";

import "../../style/global.scss";
import "../../style/navbar.scss";

const NavbarComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isShrunk, setIsShrunk] = useState(false);
  const { token, userId, userRole, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;
  const isBackOfficeUser = userRole === "ADMIN";

  const handleReload = () => {
    window.location.reload();
  };

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchTerm.trim()) {
      navigate(`search?query=${encodeURIComponent(searchTerm)}`);
    }
  };

  useEffect(() => {
    const onScroll = () => {
      setIsShrunk(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar
        expand="lg"
        className={`navbar-sticky bg-m-black p-0 d-flex justify-content-center align-items-center w-100 ${
          isShrunk ? "shrink" : ""
        }`}
      >
        <div className="d-flex align-items-center w-100 monster-bg-1">
          {/* Logo md+ */}
          <Navbar.Brand
            className="bg-m-dark-gray d-flex logo-trapezoide px-2 pe-5 d-none d-lg-block pointer"
            onClick={() => navigate("home")}
          >
            <Image
              src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1759525300/Monsterpedia_Logo_2_glba3e.png"
              alt="Monsterpedia_Logo"
              className="me-3 pe-5"
              width={335}
            ></Image>
          </Navbar.Brand>

          {/* Logo sm */}
          <Navbar.Brand
            className="bg-m-dark-gray d-flex justify-content-center logo-trapezoide ps-4 pe-5 d-lg-none"
            onClick={() => navigate("home")}
          >
            <Image
              src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1756132168/Monsterpedia_Logo_oaanuz.png"
              alt="Monsterpedia_Logo"
              width={126}
              className="me-3 pe-5"
            ></Image>
          </Navbar.Brand>

          {/* Search Bar Lg*/}
          <div className="w-100 d-flex justify-content-center align-items-center">
            <Form className="w-75 d-none d-md-flex" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="Unleash The Beast..."
                className="search-camp rounded-end-0"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
              <Button className="border border-1 border-m-dark-gray search-btn rounded-start-0">
                <Search size={20}></Search>
              </Button>
            </Form>
          </div>

          <div className="d-flex">
            {/* Trapezio utente md+ */}
            <div className="bg-m-dark-gray user-trapezoide d-none d-md-block">
              <PersonCircle size={88} className="text-m-dark-gray ms-4" />
            </div>

            {/* Trapezio utente sm */}
            <div className="bg-m-dark-gray user-trapezoide-small d-md-none">
              <PersonCircle size={88} className="text-m-dark-gray ms-4" />
            </div>

            <NavDropdown
              title={
                <PersonCircle
                  size={40}
                  className="pointer user text-white me-md-2"
                />
              }
              id="basic-nav-dropdown"
              className="person-dropdown bg-m-dark-gray py-4"
              align="end"
            >
              {isLoggedIn ? (
                <>
                  <NavDropdown.Item
                    as="button"
                    onClick={() => navigate(`/users/user-profile/${userId}`)}
                  >
                    My Profile
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as="button"
                    onClick={() => navigate(`/users/${userId}/favorite`)}
                  >
                    My Favorite List
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as="button"
                    onClick={() => navigate(`/users/${userId}/tasting`)}
                  >
                    My Tasting List
                  </NavDropdown.Item>

                  {isBackOfficeUser && (
                    <NavDropdown.Item
                      as="button"
                      onClick={() => navigate("/backoffice/home")}
                    >
                      MonsterOffice
                    </NavDropdown.Item>
                  )}

                  <NavDropdown.Divider className="bg-m-secondary" />

                  <NavDropdown.Item
                    onClick={() => {
                      logout();
                      navigate("/auth/login");
                      handleReload();
                    }}
                  >
                    Logout
                  </NavDropdown.Item>
                </>
              ) : (
                <>
                  <NavDropdown.Item
                    as="button"
                    onClick={() => navigate("/auth/login")}
                  >
                    Login
                  </NavDropdown.Item>

                  <NavDropdown.Item
                    as="button"
                    onClick={() => navigate("/auth/register")}
                  >
                    Sign Up
                  </NavDropdown.Item>
                </>
              )}
            </NavDropdown>
          </div>
        </div>

        <div className="d-flex d-md-none justify-content-center align-items-center py-3 bg-m-black border-bottom border-top border-1 border-m-tertiary monster-bg-1 w-100">
          <Form className="d-flex w-75" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Unleash The Beast..."
              className="search-camp rounded-end-0"
              aria-label="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button className="border border-1 border-m-dark-gray search-btn rounded-start-0">
              <Search size={20}></Search>
            </Button>
          </Form>
        </div>
      </Navbar>
    </>
  );
};

export default NavbarComponent;

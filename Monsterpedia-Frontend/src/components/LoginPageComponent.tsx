import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  FloatingLabel,
  Form,
  Image,
  InputGroup,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { AuthContext } from "../context/AuthContext";
import apiFetch from "../type/ApiFetch";

import img2 from "../assets/img 2.jpg";
import "../style/login.scss";

const LoginPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login: contextLogin } = useContext(AuthContext);

  const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError(null);

    const formData = new FormData(ev.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      // Login
      const { token, userId } = await apiFetch<{
        token: string;
        userId: number;
      }>("auth/login", "POST", payload);

      localStorage.setItem("token", token);

      // Recupero profilo
      const profile = await apiFetch<{ role: string }>(
        `users/dto/${userId}`,
        "GET",
        token
      );

      // Aggiorno contesto
      contextLogin(token, userId, profile.role);

      // Navigo al profilo
      navigate(`/user-profile/${userId}`);
    } catch (err: any) {
      setError(err.message || "Errore durante il login");
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center flex-column bg-m-tertiary rounded-5 mt-5 p-4 custom-shadow border border-2 border-m-dark-gray">
        <Image
          src={img2}
          alt="image1"
          className="w-35 rounded-3 border border-1 border-white"
        ></Image>
        <p className=" monster fs-3">Unleash The Beast</p>

        <form
          onSubmit={handleLogin}
          className="w-100 d-flex flex-column align-items-center mt-5"
        >
          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-2 w-50 formLabel rounded-2"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              className="rounded-2 form-camp"
              required
            />
          </FloatingLabel>

          <div className="position-relative w-50 mt-2">
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="formLabel rounded-2"
            >
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password@2317"
                className="rounded-2 form-camp pe-5"
                required
              />
            </FloatingLabel>

            <span
              onClick={() => setShowPassword((v) => !v)}
              className="position-absolute top-50 end-0 translate-middle-y me-3 pointer"
            >
              {showPassword ? (
                <EyeSlash className="text-white" />
              ) : (
                <Eye className="text-white" />
              )}
            </span>
          </div>

          {error && <div className="text-danger mt-2 mb-3">{error}</div>}

          <div className="d-flex justify-content-between align-items-center mt-2 w-50">
            <Link
              to="/auth/forgot-password"
              className="ms-4 fw-semibold text-decoration-none pointer small link"
            >
              Hai dimenticato la Password?
            </Link>
            <Link
              to="/auth/register"
              className="me-4 fw-semibold text-decoration-none pointer small link"
            >
              Crea un account
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-5 mb-3 px-5 py-1 rounded-pill border border-1 loginBtn"
          >
            <span className="monster fs-4">Accedi</span>
          </Button>
        </form>
      </Container>
    </>
  );
};

export default LoginPageComponent;

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Container, FloatingLabel, Form, Image } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { AuthContext } from "../../context/AuthContext";
import apiFetch from "../../type/ApiFetch";

import img2 from "../../assets/img 2.jpg";
import MonsterSpinner from "../Element/Spinner";
import "../../style/login.scss";

const LoginPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { login: contextLogin } = useContext(AuthContext);
  const [passwordIsFocus, setPasswordIsFocus] = useState(false);
  const [passwordIsHover, setPasswordIsHover] = useState(false);

  const handleLogin = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError(null);

    const formData = new FormData(ev.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      setLoading(true);

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

      if (token) {
        navigate(`/users/user-profile/${userId}`);
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error).message;
      if (errorMessage.includes("403") || errorMessage.includes("404")) {
        setError("Utente con questa email/password non trovato");
      } else {
        setError(`Errore durante il login:${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-m-tertiary d-flex align-items-center justify-content-center">
        <MonsterSpinner /> <p>Caricamento...</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center flex-column rounded-5 mt-5 p-4 custom-shadow border border-2 border-m-dark-gray custom-bg">
        <Image
          src={img2}
          alt="image1"
          className="w-35 rounded-3 border border-1 border-white"
        ></Image>
        <p className=" monster fs-3">Unleash The Beast</p>

        <h1 className="fs-2">---------- Login ----------</h1>

        <form
          onSubmit={handleLogin}
          className="w-100 d-flex flex-column align-items-center mt-4"
        >
          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-2 w-75 formLabel rounded-2"
          >
            <Form.Control
              type="email"
              name="email"
              placeholder="name@example.com"
              className="rounded-2 form-camp w-100"
              required
            />
          </FloatingLabel>

          <div className="w-100 d-flex flex-column align-items-center mt-2 position-relative">
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="w-75 formLabel rounded-2"
            >
              <Form.Control
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password@2317"
                className="rounded-2 form-camp"
                required
                onFocus={() => setPasswordIsFocus(true)}
                onBlur={() => setPasswordIsFocus(false)}
                onMouseEnter={() => setPasswordIsHover(true)}
                onMouseLeave={() => setPasswordIsHover(false)}
              />
            </FloatingLabel>

            <span
              onClick={() => setShowPassword((v) => !v)}
              className="eye-toggle pointer mx-3 mx-md-4"
            >
              {showPassword ? (
                <EyeSlash
                  className={`${
                    passwordIsFocus || passwordIsHover
                      ? "text-m-dark-gray"
                      : "text-white"
                  }`}
                />
              ) : (
                <Eye className="text-white" />
              )}
            </span>
          </div>

          {error && (
            <div
              style={{
                color: "red",
                fontWeight: "semi-bold",
                marginTop: "10px",
              }}
            >
              {error}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mt-2 w-78">
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

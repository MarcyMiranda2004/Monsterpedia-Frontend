import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Container, Form, Image, FloatingLabel, Button } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";

import { AuthContext } from "../context/AuthContext";
import apiFetch from "../type/ApiFetch";
import type { RegisterPayload, LoginPayload } from "../type/AuthType";

import img2 from "../assets/img 2.jpg";
import "../style/registration.scss";

const RegistrationPageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(true);

  const [passwordIsFocus, setPasswordIsFocus] = useState(false);
  const [passwordIsHover, setPasswordIsHover] = useState(false);

  const { login: contextLogin } = useContext(AuthContext);

  const handleRegistration = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setError(null);

    const formData = new FormData(ev.currentTarget);
    const raw = Object.fromEntries(formData.entries());

    const payloadRegister: RegisterPayload = {
      username: raw.username as string,
      email: raw.email as string,
      password: raw.password as string,
    };

    const payloadLogin: LoginPayload = {
      email: raw.email as string,
      password: raw.password as string,
    };

    try {
      await apiFetch<{ message: string }>(
        "auth/register",
        "POST",
        payloadRegister
      );

      const { token, userId } = await apiFetch<{
        token: string;
        userId: number;
      }>("auth/login", "POST", payloadLogin);

      localStorage.setItem("token", token);

      const profile = await apiFetch<{ role: string }>(`users/dto/${userId}`);

      contextLogin(token, userId, profile.role);

      navigate(`/user-profile/${userId}`);
    } catch (err: any) {
      if (err.message.includes("409")) {
        setError("Questa email è già registrata");
      } else {
        setError(err.message ?? "Errore durante la registrazione");
      }
    }
  };

  return (
    <>
      <Container className="d-flex justify-content-center align-items-center flex-column bg-m-tertiary rounded-5 mt-5 p-4 custom-shadow border border-2 border-m-dark-gray custom-bg">
        <Image
          src={img2}
          alt="image1"
          className="w-35 rounded-3 border border-1 border-white"
        ></Image>
        <p className=" monster fs-3">Unleash The Beast</p>

        <h1 className="fs-2">---------- Sign up ----------</h1>

        <form
          className="w-100 d-flex flex-column align-items-center mt-4"
          onSubmit={handleRegistration}
        >
          <FloatingLabel
            controlId="floatingInput"
            label="Username"
            className="mb-2 w-75 formLabel rounded-2"
          >
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              className="rounded-2 form-camp w-100"
              required
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingInput"
            label="Email"
            className="mb-2 mt-2 w-75 formLabel rounded-2"
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

          {error && <div className="text-danger mt-2 mb-3">{error}</div>}

          <div className="d-flex justify-content-between align-items-center mt-2 w-78">
            <div></div>

            <Link
              to="/auth/login"
              className="me-4 fw-semibold text-decoration-none pointer small link"
            >
              Hai già un account?
            </Link>
          </div>

          <Button
            type="submit"
            className="mt-5 mb-3 px-5 py-1 rounded-pill border border-1 loginBtn"
          >
            <span className="monster fs-4">Registrati</span>
          </Button>
        </form>
      </Container>
    </>
  );
};

export default RegistrationPageComponent;

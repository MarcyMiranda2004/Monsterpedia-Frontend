import React, { useState, useEffect, useContext, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Image,
  Row,
  Col,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap";

import { AuthContext } from "../context/AuthContext";
import apiFetch from "../type/ApiFetch";
import type { ChangePasswordDto, UpdateUserDto, UserDto } from "../type/User";

import avatarPlaceholder from "../assets/placeholder.png";
import { InfoCircleFill } from "react-bootstrap-icons";
import { Spinner } from "react-bootstrap";
import "../style/userPage.scss";
import "../style/login.scss";

const UserProfilePageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isShowInfo, setIsShowInfo] = useState(false);

  const { token, userId: ctxUserId, logout } = useContext(AuthContext); // dal AuthContext recupero token userId (salvato con il nome ctxUserId) e logout
  const { userId: paramUserId } = useParams<{ userId: string }>(); // recupero lo userId dal parametro variabile ":userId" dell'URL salvandolo come paramUserId
  const uid = paramUserId ?? ctxUserId?.toString(); // dichiaro che uid ha come valore lo userId ricavato dal parametro ma se esso e undefine o null invece ha come valore allo userId ricavato dal contesto

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserDto | null>(null);
  const [usernameDto, setUsernameDto] = useState<UpdateUserDto>({
    username: "",
  });
  const [password, setPassword] = useState("");
  const [passwordDto, setPasswordDto] = useState<ChangePasswordDto | null>(
    null
  );

  const [showEditAvatar, setShowEditAvatar] = useState(false);
  const [showEditUsername, setShowEditUsername] = useState(false);
  const [showEditEmail, setShowEditEmail] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Recupero User
  useEffect(() => {
    if (!uid) {
      setError("User ID non disponibile");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const userData = await apiFetch<UserDto>(`users/dto/${uid}`, "GET");
        setUser(userData);
      } catch (error: any) {
        console.error("Errore nel recupero dati utente: " + error);
        setError("Errore nel recupero dati utente");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [uid]);

  // Modifica Username
  const openEditUsername = () => {
    if (user) {
      setUsernameDto({ username: user.username });
      setShowEditUsername(true);
    }
  };

  const handleEditUsername = async (ev: FormEvent) => {};

  // Elimina Account
  const handleDeleteAccount = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      await apiFetch(`users/${uid}`, "DELETE", { password });

      logout();
      setPassword("");
      navigate("/home");
    } catch (error: any) {
      console.error("Errore durante l'eliminazione:", error);
      alert(`Impossibile eliminare l'account: ${error.message}`);
    }
  };

  if (loading) return <p>Caricamento in corso...</p>;
  if (error) return <p>{error}</p>;
  if (!user) return <p>Utente non trovato</p>;

  return (
    <>
      <Container className="profile-bg rounded-3 pt-5 pb-3 d-flex flex-column justify-content-center align-items-center position-relative mt-5">
        <InfoCircleFill
          className="text-m-tertiary position-absolute top-0 end-0 m-2 pointer info-icon rounded-circle"
          size={25}
          onClick={() => setIsShowInfo((prev) => !prev)}
        />
        <p
          className={`bg-m-secondary-sub border border-2 border-m-quaternary p-2 rounded-3 ${
            isShowInfo ? "d-block" : "d-none"
          }`}
        >
          Se vuoi modificare uno dei tuoi dati utente, clicca su di esso,
          comparirà un menu per poter effettuare la modifica
        </p>

        <div className="mb-5 d-flex flex-column align-items-center justify-content-center">
          <Image
            src={user.avatarUrl || avatarPlaceholder}
            alt="user_image"
            className="rounded-3 rounded-3 userImg pointer mb-2 border border-1 border-m-secondary"
            width={250}
            fluid
            onClick={() => setShowEditAvatar(true)}
          />
          <div className="w-100 d-flex flex-column justify-content-center align-items-center mb-0">
            <span
              className="monster-username pointer mb-3 fs-1"
              onClick={openEditUsername}
            >
              {user.username || "Username"}
            </span>
            <p
              className="monster-email pointer mb-0 fs-5"
              onClick={() => setShowEditEmail(true)}
            >
              {user.email || "email@dominio.net"}
            </p>
            <p
              className="pointer monster-password mt-0 fs-5"
              onClick={() => setShowEditPassword(true)}
            >
              Password
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Button onClick={() => setShowDelete(true)} className="delete-btn">
            ⚠ Elimina Account ⚠
          </Button>
        </div>
      </Container>

      {/* Modale Elimina Account */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Form
          onSubmit={handleDeleteAccount}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Elimina Account</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Sei sicuro di voler eliminare definitivamente il tuo account?
              Inserisci la tua password per confermare.
            </p>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="formLabel rounded-2"
            >
              <Form.Control
                name="password"
                placeholder="Password@2317"
                className="rounded-2 form-camp"
                required
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDelete(false)}
              className="customBtn"
            >
              Annulla
            </Button>
            <Button type="submit" className="conferme-delete-btn">
              Elimina
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modale Modifica Username */}
      <Modal show={showEditUsername} onHide={() => setShowEditUsername(false)}>
        <Form
          onSubmit={handleEditUsername}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="white">
            <Modal.Title>Modifica Username</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              name="Username"
              value={usernameDto.username}
              onChange={(e) => setUsernameDto({ username: e.target.value })}
              className="rounded-2 form-camp p-2 ps-3"
              required
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditUsername(false)}
              className="customBtn"
            >
              Annulla
            </Button>
            <Button type="submit" className="save-btn">
              Salva
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UserProfilePageComponent;

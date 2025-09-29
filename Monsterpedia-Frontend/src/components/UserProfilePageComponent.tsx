import React, { useState, useEffect, useContext, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Image,
  Button,
  Modal,
  Form,
  FloatingLabel,
} from "react-bootstrap";

import { useUserId } from "../type/UseUserId";
import apiFetch from "../type/ApiFetch";
import { apiUpload } from "../type/ApiUpload";
import {
  type ChangeEmailDto,
  type ChangePasswordDto,
  type UpdateUserDto,
  type UserDto,
} from "../type/User";

import avatarPlaceholder from "../assets/placeholder.png";
import { InfoCircleFill } from "react-bootstrap-icons";
import "../style/userPage.scss";
import "../style/login.scss";

const UserProfilePageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [isShowInfo, setIsShowInfo] = useState(false);

  const { uid, logout } = useUserId();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useState<UserDto | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [usernameDto, setUsernameDto] = useState<UpdateUserDto>({
    username: "",
  });
  const [emailDto, setEmailDto] = useState<ChangeEmailDto>({
    password: "",
    currentEmail: "",
    newEmail: "",
    confirmNewEmail: "",
  });
  const [password, setPassword] = useState("");
  const [passwordDto, setPasswordDto] = useState<ChangePasswordDto>({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

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

  // Modifica Avatar
  const handleEditAvatar = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!uid || !selectedFile) return;

    try {
      const updatedUser = await apiUpload<UserDto>(
        `users/${uid}/avatar`,
        selectedFile
      );
      setUser(updatedUser);
      setShowEditAvatar(false);
      setSelectedFile(null);
    } catch (error: any) {
      console.error("Errore durante la modifica dell'Avatar", error);
      alert(`Impossibile modificare l'avatar: ${error.message}`);
    }
  };

  // Modifica Username
  const openEditUsername = () => {
    if (user) {
      setUsernameDto({ username: user.username });
      setShowEditUsername(true);
    }
  };

  const handleEditUsername = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!uid) return;

    try {
      const updatedUser = await apiFetch<UserDto>(
        `users/${uid}/username`,
        "PATCH",
        usernameDto
      );

      setUser(updatedUser);
      setShowEditUsername(false);
    } catch (error: any) {
      console.error("Errore durante la modifica dell'username: ", error);
      alert(`Impossibile modificare l'username: ${error.message}`);
    }
  };

  // Modifica Password
  const handleEditPassword = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!uid) return;

    try {
      const updateUser = await apiFetch<UserDto>(
        `users/${uid}/password`,
        "PUT",
        {
          oldPassword: passwordDto.oldPassword,
          newPassword: passwordDto.newPassword,
          confirmNewPassword: passwordDto.confirmNewPassword,
        }
      );

      setUser(updateUser);
      setShowEditPassword(false);
    } catch (error: any) {
      console.error("Errore durante la modifica della password: " + error);
      alert(`impossibile modificare la password: ${error.message}`);
    }
  };

  // Modifica Email
  const openEditEmail = () => {
    if (user) {
      setEmailDto({
        password: "",
        currentEmail: user.email,
        newEmail: "",
        confirmNewEmail: "",
      });
      setShowEditEmail(true);
    }
  };

  const handleEditEmail = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!uid) return;

    try {
      const updatedUser = await apiFetch<UserDto>(`users/${uid}/email`, "PUT", {
        password: emailDto.password,
        currentEmail: emailDto.currentEmail,
        newEmail: emailDto.newEmail,
        confirmNewEmail: emailDto.confirmNewEmail,
      });

      setUser(updatedUser);
      setShowEditEmail(false);
    } catch (error: any) {
      console.error("Errore durante la modifica dell'email: " + error);
      alert(`impossibile modificare l'email: ${error.message}`);
    }
  };

  // Elimina Account
  const handleDeleteAccount = async (ev: FormEvent) => {
    ev.preventDefault();

    if (!uid) return;

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
            className="rounded-3 rounded-3 userImg pointer mb-2 border border-2 border-m-secondary"
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
              onClick={openEditEmail}
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

      {/* Modale Modifica Avatar */}
      <Modal show={showEditAvatar} onHide={() => setShowEditAvatar(false)}>
        <Form
          onSubmit={handleEditAvatar}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="dark">
            <Modal.Title>Modifica il tuo Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              type="file"
              required
              name="file"
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                const file = input.files?.[0] || null;
                setSelectedFile(file);
              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditAvatar(false)}
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

      {/* Modale Modifica Username */}
      <Modal show={showEditUsername} onHide={() => setShowEditUsername(false)}>
        <Form
          onSubmit={handleEditUsername}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="dark">
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

      {/* Modale Modifica Email */}
      <Modal show={showEditEmail} onHide={() => setShowEditEmail(false)}>
        <Form
          onSubmit={handleEditEmail}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="dark">
            <Modal.Title>Modifica Email</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel
              controlId="floatingPassword"
              label="Password"
              className="formLabel rounded-2 mb-2"
            >
              <Form.Control
                name="Password"
                placeholder="Password@2317"
                className="rounded-2 form-camp"
                onChange={(e) =>
                  setEmailDto((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                required
              />
            </FloatingLabel>

            <div className="formLabel rounded-2 my-2">
              <Form.Control
                name="Current Email"
                value={emailDto.currentEmail}
                onChange={(e) =>
                  setEmailDto((prev) => ({
                    ...prev,
                    currentEmail: e.target.value,
                  }))
                }
                placeholder="current.email@dominio.net"
                className="rounded-2 form-camp py-3"
                required
              />
            </div>

            <FloatingLabel
              controlId="floatingNewMail"
              label="New Email"
              className="formLabel rounded-2 my-2"
            >
              <Form.Control
                name="New Mail"
                onChange={(e) =>
                  setEmailDto((prev) => ({ ...prev, newEmail: e.target.value }))
                }
                placeholder="new.email@dominio.net"
                className="rounded-2 form-camp"
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingConfirmNewEmail"
              label="Confirm New Email"
              className="formLabel rounded-2 my-2"
            >
              <Form.Control
                name="Confirm Mail"
                onChange={(e) =>
                  setEmailDto((prev) => ({
                    ...prev,
                    confirmNewEmail: e.target.value,
                  }))
                }
                placeholder="confirm.email@dominio.net"
                className="rounded-2 form-camp"
                required
              />
            </FloatingLabel>
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

      {/* Modale Modifica Password */}
      <Modal show={showEditPassword} onHide={() => setShowEditPassword(false)}>
        <Form
          onSubmit={handleEditPassword}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="dark">
            <Modal.Title>Modifica Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FloatingLabel
              controlId="floatingPassword"
              label="Old Password"
              className="formLabel rounded-2 my-2"
              onChange={(e) => ({})}
            >
              <Form.Control
                name="Old Password"
                placeholder="OldPassword@2317"
                className="rounded-2 form-camp"
                onChange={(e) =>
                  setPasswordDto((prev) => ({
                    ...prev,
                    oldPassword: e.target.value,
                  }))
                }
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingPassword"
              label="New Password"
              className="formLabel rounded-2 my-2"
            >
              <Form.Control
                name="Password"
                placeholder="NewPassword@2317"
                className="rounded-2 form-camp"
                onChange={(e) =>
                  setPasswordDto((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="floatingPassword"
              label="Confirm New Password"
              className="formLabel rounded-2 my-2"
            >
              <Form.Control
                name="Password"
                placeholder="ConfermeNewPassword@2317"
                className="rounded-2 form-camp"
                onChange={(e) =>
                  setPasswordDto((prev) => ({
                    ...prev,
                    confirmNewPassword: e.target.value,
                  }))
                }
                required
              />
            </FloatingLabel>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditPassword(false)}
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

      {/* Modale Elimina Account */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)}>
        <Form
          onSubmit={handleDeleteAccount}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg"
        >
          <Modal.Header closeButton closeVariant="dark">
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
                name="Password"
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
    </>
  );
};

export default UserProfilePageComponent;

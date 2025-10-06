import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Form,
  Modal,
} from "react-bootstrap";
import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { CreateAndUpdateMonsterDto } from "../../type/Monster";

import MonsterSpinner from "../Element/Spinner";
import {
  ArrowLeft,
  ArrowRight,
  PlusLg,
  HouseFill,
  Search,
  PencilFill,
  TrashFill,
} from "react-bootstrap-icons";

import apiFetch from "../../type/ApiFetch";
import type { MonsterDto, Category } from "../../type/Monster";
import { Categories } from "../../type/Monster";

import "../../style/backOffice.scss";

const BackOfficeHomeComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monsters, setMonsters] = useState<MonsterDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditMonster, setShowEditMonster] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState<MonsterDto | null>(
    null
  );
  const [showAddMonster, setShowAddMonster] = useState(false);
  const [newMonster, setNewMonster] = useState<CreateAndUpdateMonsterDto>({
    name: "",
    category: "" as Category,
    flavor: "",
    origin: "",
    description: "",
    story: "",
    imageUrl: "",
    marcyOpinion: "",
  });

  // --- Fetch Monsters ---
  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        setLoading(true);
        const monsters = await apiFetch<MonsterDto[]>("monsters", "GET");
        setMonsters(monsters);
      } catch (error: unknown) {
        console.error(`Errore nel recupero delle monster: ${error}`);
        setError("Impossibile caricare le monster");
      } finally {
        setLoading(false);
      }
    };
    fetchMonsters();
  }, []);

  // --- Delete Monster ---
  const handleDelete = async (mId: number) => {
    if (!window.confirm("Confermi eliminazione?")) return;
    try {
      await apiFetch(`monsters/${mId}`, "DELETE");
      setMonsters((prev) => prev.filter((m) => m.id !== mId));
    } catch (error: unknown) {
      setError(`Errore nell'eliminazione della Monster`);
      console.error(`Impossibile eliminare la monster, ${error}`);
    }
  };

  // --- Edit Monster ---
  const handleEditMonster = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!selectedMonster) return;
    try {
      const updated = await apiFetch<MonsterDto>(
        `monsters/${selectedMonster.id}`,
        "PUT",
        selectedMonster
      );
      setMonsters((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
      setShowEditMonster(false);
      setSelectedMonster(null);
    } catch (error: unknown) {
      setError("Errore nell'aggiornamento della Monster");
      console.error(`Impossibile aggiornare la monster, ${error}`);
    }
  };

  // --- Add Monster ---
  const handleAddMonster = async (ev: FormEvent) => {
    ev.preventDefault();
    try {
      const created = await apiFetch<MonsterDto>(
        "monsters",
        "POST",
        newMonster
      );
      setMonsters((prev) => [...prev, created]);
      setShowAddMonster(false);
      setNewMonster({
        name: "",
        category: "" as Category,
        flavor: "",
        origin: "",
        description: "",
        story: "",
        imageUrl: "",
        marcyOpinion: "",
      });
    } catch (error: unknown) {
      console.error(`Errore nella creazione della Monster ${error}`);
      setError(`Errore nella creazione della monster: ${error}`);
    }
  };

  // --- Filtro di ricerca Categoria/Nome ---
  const filteredMonsters = monsters.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Paginazione ---
  const [currentPage, setCurrentPage] = useState(1);
  const monstersPerPage = 20;
  const indexOfLastMonster = currentPage * monstersPerPage;
  const indexOfFirstMonster = indexOfLastMonster - monstersPerPage;
  const currentMonsters = filteredMonsters.slice(
    indexOfFirstMonster,
    indexOfLastMonster
  );

  // --- Loading/Error UI ---
  if (loading) {
    return (
      <Container className="text-m-tertiary d-flex align-items-center justify-content-center">
        <MonsterSpinner /> <p>Caricamento...</p>
      </Container>
    );
  }
  if (error) return <p className="text-danger">{error}</p>;
  if (!monsters)
    return <p className="text-danger">Errore nel recupero delle monster</p>;

  return (
    <>
      <Container className="d-flex flex-column align-items-center justify-content-center m-custom">
        <h1 className="monster-bold text-m-tertiary">Monster Office</h1>

        <Container className="border-top border-2 border-m-tertiary pt-5">
          <div className="d-flex justify-content-between align-items-center my-3">
            <div className="d-md-none">
              <Button
                className="text-m-white border border-1 border-m-dark-gray m-0 bo-btn"
                onClick={() => navigate("/home")}
              >
                <HouseFill size={22} />
              </Button>
            </div>

            <div className="d-none d-md-block">
              <Button
                className="text-m-white border border-1 border-m-dark-gray m-0 bo-btn"
                onClick={() => navigate("/home")}
              >
                <ArrowLeft /> Torna alla Home
              </Button>
            </div>

            <div className="w-75 d-flex justify-content-center align-items-center">
              <Form
                className="w-75 d-flex"
                onSubmit={(e) => e.preventDefault()}
              >
                <Form.Control
                  type="search"
                  placeholder="Nome o categoria..."
                  className="search-camp rounded-end-0"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.currentTarget.value)}
                />
                <Button className="border border-1 border-m-dark-gray search-btn rounded-start-0">
                  <Search size={20} />
                </Button>
              </Form>
            </div>

            <div className="d-none d-md-block">
              <Button
                className="text-m-white border border-1 border-m-dark-gray m-0 bo-btn"
                onClick={() => setShowAddMonster(true)}
              >
                Aggiungi Monster
              </Button>
            </div>
            <div className="d-md-none">
              <Button className="text-m-white border border-1 border-m-dark-gray m-0 bo-btn">
                <PlusLg size={20} />
              </Button>
            </div>
          </div>

          {/* Tabella Desktop */}
          <Container className="d-none d-md-block">
            <Row className="bg-m-dark-gray text-white p-2 pb-1 rounded-top-2">
              <Col>Id</Col>
              <Col>Nome</Col>
              <Col>Categoria</Col>
              <Col>Origine</Col>
              <Col>Dettagli</Col>
              <Col>Azioni</Col>
            </Row>

            {currentMonsters.map((m) => (
              <Row
                key={m.id}
                className="bg-m-white-sub border-bottom border-2 border-m-dark-gray d-flex align-items-center p-2"
              >
                <Col>{m.id}</Col>
                <Col>{m.name}</Col>
                <Col>{m.category}</Col>
                <Col>{m.origin}</Col>
                <Col>
                  <p
                    className="details m-0"
                    onClick={() =>
                      window.open(`/monsters/${m.id}/details`, "_blank")
                    }
                  >
                    Dettagli <ArrowRight />
                  </p>
                </Col>
                <Col>
                  <PencilFill
                    className="text-m-tertiary me-2 pointer action-btn"
                    size={20}
                    onClick={() => {
                      setSelectedMonster(m);
                      setShowEditMonster(true);
                    }}
                  />
                  <TrashFill
                    className="text-m-danger ms-2 pointer action-btn"
                    size={20}
                    onClick={() => handleDelete(m.id)}
                  />
                </Col>
              </Row>
            ))}
          </Container>

          {/* Mobile Cards */}
          <Container className="d-md-none pt-4">
            {currentMonsters.map((m) => (
              <Card
                key={m.id}
                className="mb-3 shadow-sm border border-1 border-m-dark-gray"
              >
                <Card.Title className="bg-m-dark-gray text-white p-2">
                  {m.name}
                </Card.Title>
                <Card.Body>
                  <Card.Text>
                    <strong>Id:</strong> {m.id} <br />
                    <strong>Categoria:</strong> {m.category} <br />
                    <strong>Origine:</strong> {m.origin}
                  </Card.Text>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() =>
                      window.open(`/monsters/${m.id}/details`, "_blank")
                    }
                  >
                    Dettagli <ArrowRight />
                  </Button>
                  <div className="mt-3">
                    <PencilFill
                      className="text-m-tertiary me-2 pointer action-btn"
                      size={20}
                      onClick={() => {
                        setSelectedMonster(m);
                        setShowEditMonster(true);
                      }}
                    />
                    <TrashFill
                      className="text-m-danger ms-2 pointer action-btn"
                      size={20}
                      onClick={() => handleDelete(m.id)}
                    />
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Container>

          {/* Paginazione */}
          <div className="d-flex justify-content-between mt-2">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="bg-m-tertiary border border-2 border-m-tertiary"
            >
              <ArrowLeft size={22} />
            </Button>

            <div className="border-bottom border-2 border-m-tertiary px-3">
              <span className="text-white fs-5 ">{currentPage}</span>
            </div>

            <Button
              disabled={indexOfLastMonster >= filteredMonsters.length}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="bg-m-tertiary border border-2 border-m-tertiary"
            >
              <ArrowRight size={22} />
            </Button>
          </div>
        </Container>
      </Container>

      {/* Modale Add Monster */}
      <Modal show={showAddMonster} onHide={() => setShowAddMonster(false)}>
        <Form
          onSubmit={handleAddMonster}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg p-3"
        >
          <Modal.Header closeButton>
            <Modal.Title>Aggiungi Monster</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nome"
                value={newMonster.name}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Categoria</Form.Label>
              <Form.Select
                value={newMonster.category}
                onChange={(e) =>
                  setNewMonster({
                    ...newMonster,
                    category: e.target.value as Category,
                  })
                }
                required
                aria-label="Categoria Monster"
              >
                <option value="">Seleziona categoria</option>
                {Categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Sapore</Form.Label>
              <Form.Control
                type="text"
                placeholder="Sapore"
                value={newMonster.flavor || ""}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, flavor: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Origine</Form.Label>
              <Form.Control
                type="text"
                placeholder="Origine"
                value={newMonster.origin || ""}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, origin: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Descrizione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Descrizione"
                value={newMonster.description || ""}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Storia</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Storia"
                value={newMonster.story || ""}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, story: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>URL Immagine</Form.Label>
              <Form.Control
                type="url"
                placeholder="URL Immagine"
                value={newMonster.imageUrl || ""}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, imageUrl: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Marcy Opinion</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Marcy Opinion"
                value={newMonster.marcyOpinion || ""}
                onChange={(e) =>
                  setNewMonster({ ...newMonster, marcyOpinion: e.target.value })
                }
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowAddMonster(false)}
            >
              Annulla
            </Button>
            <Button type="submit" className="save-btn">
              Crea Monster
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Modale Edit Monster */}
      <Modal show={showEditMonster} onHide={() => setShowEditMonster(false)}>
        <Form
          onSubmit={handleEditMonster}
          className="border border-2 border-m-dark-gray rounded-3 custom-bg p-3"
        >
          <Modal.Header closeButton>
            <Modal.Title>Modifica Monster</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {selectedMonster && (
              <>
                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Nome"
                  value={selectedMonster.name}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      name: e.target.value,
                    })
                  }
                  required
                />
                <Form.Select
                  className="mb-2"
                  value={selectedMonster.category}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      category: e.target.value as Category,
                    })
                  }
                  required
                  aria-label="Categoria Monster"
                >
                  <option value="">Seleziona categoria</option>
                  {Categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Form.Select>

                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Sapore"
                  value={selectedMonster.flavor || ""}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      flavor: e.target.value,
                    })
                  }
                />

                <Form.Control
                  className="mb-2"
                  type="text"
                  placeholder="Origine"
                  value={selectedMonster.origin || ""}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      origin: e.target.value,
                    })
                  }
                />

                <Form.Control
                  className="mb-2"
                  as="textarea"
                  rows={3}
                  placeholder="Descrizione"
                  value={selectedMonster.description || ""}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      description: e.target.value,
                    })
                  }
                />

                <Form.Control
                  className="mb-2"
                  as="textarea"
                  rows={3}
                  placeholder="Storia"
                  value={selectedMonster.story || ""}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      story: e.target.value,
                    })
                  }
                />

                <Form.Control
                  className="mb-2"
                  type="url"
                  placeholder="URL Immagine"
                  value={selectedMonster.imageUrl || ""}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      imageUrl: e.target.value,
                    })
                  }
                />

                <Form.Control
                  className="mb-2"
                  as="textarea"
                  rows={2}
                  placeholder="Marcy Opinion"
                  value={selectedMonster.marcyOpinion || ""}
                  onChange={(e) =>
                    setSelectedMonster({
                      ...selectedMonster,
                      marcyOpinion: e.target.value,
                    })
                  }
                />
              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditMonster(false)}
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

export default BackOfficeHomeComponent;

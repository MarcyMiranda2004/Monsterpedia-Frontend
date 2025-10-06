import { Alert, Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import apiFetch from "../../type/ApiFetch";
import MonsterSpinner from "../Element/Spinner";
import type { MonsterDto } from "../../type/Monster";

const SearchPageComponent: React.FC = () => {
  const [params] = useSearchParams();
  const query = params.get("query") || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monsters, setMonsters] = useState<MonsterDto[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!query) {
      setError("Devi inserire un termine di ricerca");
      setLoading(false);
      return;
    }

    const searchFetch = async () => {
      try {
        setLoading(true);
        const response = await apiFetch<{ content: MonsterDto[] }>(
          `monsters/search?name=${query}`,
          "GET"
        );

        setMonsters(response.content);
      } catch (error: unknown) {
        const errorMessage = (error as Error).message;
        setError(`Errore nella ricerca: ${errorMessage}`);
        console.error("Errore nella fetch di ricerca:", errorMessage);
      } finally {
        setLoading(false);
      }
    };

    searchFetch();
  }, [query]);

  if (loading) {
    return (
      <Container className="text-m-tertiary d-flex align-items-center justify-content-center">
        <MonsterSpinner /> <p>Caricamento...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="d-flex align-items-center justify-content-center">
        <p className="text-danger">{error}</p>;
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="text-m-tertiary text-center mb-5 m-custom">
        Risultati per: "<span className="monster">{query}</span>"
      </h2>

      <Container className="border-top border-2 border-m-tertiary pt-5">
        {monsters.length === 0 && (
          <Alert variant="warning" className="text-center fw-bold">
            Nessuna Monster trovata.
          </Alert>
        )}

        <Row>
          {monsters.map((m) => (
            <Col key={m.id} sm={6} md={4} lg={2}>
              <div className="d-flex flex-wrap gap-3 p-4 pb-3">
                <Card key={m.id} style={{ width: "6rem" }} className="bg-none">
                  <Card.Img
                    variant="top"
                    src={m.imageUrl}
                    className="pointer monster-img"
                    onClick={() => navigate(`/monsters/${m.id}/details`)}
                  />
                </Card>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </Container>
  );
};

export default SearchPageComponent;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import apiFetch from "../type/ApiFetch";
import type { MonsterDto } from "../type/Monster";

import "../style/registration.scss";

const MonsterDetailsComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
  const [monster, setMonster] = useState<MonsterDto | null>(null);
  const { monsterId } = useParams<{ monsterId: string }>();

  useEffect(() => {
    if (!monsterId) {
      setError("Errore: ID della monster non disponibile");
      setLoading(false);
      return;
    }

    const fetchMonsters = async () => {
      try {
        setLoading(true);
        const monster = await apiFetch<MonsterDto>(
          `monsters/id/${monsterId}`,
          "GET"
        );
        setMonster(monster);
      } catch (error: any) {
        console.error("Errore nel recupero dei dati della monster");
        setError("Impossibile recuperare i dati della monster");
      } finally {
        setLoading(false);
      }
    };

    fetchMonsters();
  }, [monsterId]);

  if (loading) {
    return <p>Caricamento...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!monster) return <p>Nessuna monster trovata.</p>;

  return (
    <>
      <Container className="custom-bg">
        <Row>
          <Col sx={4} md={2}>
            <Image
              src={monster?.imageUrl}
              alt={monster?.name}
              fluid
              className="m-3"
              width="200px"
            ></Image>
          </Col>
          <Col sx={8}>
            <p>{monster.description}</p>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MonsterDetailsComponent;

import { useEffect, useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import { useParams } from "react-router-dom";
import apiFetch from "../../type/ApiFetch";

import { categoryLogos, type MonsterDto } from "../../type/Monster";

import MonsterSpinner from "../Element/Spinner";
import "../../style/details.scss";

const MonsterDetailsComponent = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monster, setMonster] = useState<MonsterDto | null>(null);
  const { monsterId } = useParams<{ monsterId: string }>();

  const [showOpinion, setShowOpinion] = useState(false);

  const logo = monster ? categoryLogos[monster.category] : undefined;

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
      } catch (error: unknown) {
        console.error(
          `Errore nel recupero dei dati della monster | Errore: ${error}`
        );
        setError("Impossibile recuperare i dati della monster");
      } finally {
        setLoading(false);
      }
    };

    fetchMonsters();
  }, [monsterId]);

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

  if (!monster) return <p>Nessuna monster trovata.</p>;

  return (
    <>
      <Container className="detail-custom-bg text-white border border-3 border-m-light-gray p-5 mt-custom">
        {logo && (
          <Image
            src={logo}
            alt={`Logo ${monster.category}`}
            width={200}
            className="mb-3 monster-category p-2"
          />
        )}

        <div
          className={`w-75 opinion-container mt-5 p-2 pb-0p ${
            showOpinion ? "d-block" : "d-none"
          }`}
        >
          <h2 className="fs-4 fw-bold fst-italic">Marcy Opinion</h2>
          <p className="">{monster.marcyOpinion}</p>
        </div>

        {/* opinion btn mobile */}
        <Image
          src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1759246727/M-removebg-preview_1_pz6nyf.png"
          alt="Marcy_Opinion-Monogram"
          width="35px"
          className="opinion-btn mt-2 me-2 mb-4 ms-3 p-1 pt-2 pointer rounded-circle d-md-none position-absolute top-0 end-0"
          onClick={() => setShowOpinion((prev) => !prev)}
        ></Image>

        <Row className="mb-0 mb-md-4">
          <div className="d-flex flex-wrap align-item-center">
            <h1 className="fs-1">
              {monster.name} ({monster.origin})
            </h1>

            {/* opinion btn desktop */}
            <Image
              src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1759246727/M-removebg-preview_1_pz6nyf.png"
              alt="Marcy_Opinion-Monogram"
              width="35px"
              className="opinion-btn mt-2 me-2 mb-4 ms-3  p-1 pt-2 pointer rounded-circle d-none d-md-block"
              onClick={() => setShowOpinion((prev) => !prev)}
            ></Image>
          </div>
        </Row>

        <Row>
          {/* img mobile */}
          <Col
            sm={12}
            md={12}
            lg={4}
            className="d-block d-lg-none d-flex flex-column align-items-center justify-content-center"
          >
            <Image
              src={monster?.imageUrl}
              alt={monster?.name}
              fluid
              className="m-3 absolute-monster-img"
              width="150px"
            ></Image>
          </Col>

          <Col sm={12} md={12} lg={4}>
            <div className="mb-4 mb-md-0">
              <h2 className="fs-4 fw-bold">STORIA</h2>
              <p>{monster.story}</p>
            </div>
          </Col>

          <Col sm={12} md={12} lg={4}>
            <div className="mb-4">
              <h2 className="fs-4 fw-bold">DESCRIZIONE</h2>
              <p>{monster.description}</p>
            </div>

            <div className="pb-3">
              <h2 className="fs-4 fw-bold ">SAPORE</h2>
              <p>{monster.flavor}</p>
            </div>
          </Col>

          {/* img desktop */}
          <Col sm={3} md={12} lg={4} className="d-none d-lg-block">
            <Image
              src={monster?.imageUrl}
              alt={monster?.name}
              fluid
              className="m-3 absolute-monster-img"
              width="225px"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default MonsterDetailsComponent;

import React, { useContext } from "react";
import { Container, Card, Row, Col, Image } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { readdirSync, statSync } from "fs";
import path from "path";

import {
  Categories,
  type Category,
  type MonsterDto,
  type Section,
} from "../type/Monster";
import apiFetch from "../type/ApiFetch";

import "../style/home.scss";

const HomePageComponent: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<String | null>(null);
  const [section, setSection] = useState<Section<MonsterDto>[]>([]);
  const [monster, setMonster] = useState<MonsterDto[]>([]);

  const logosImg = [
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152732/Energy_Logo_duu0uv.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759159007/Espresso_Logo_yrwbuv.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152734/Java_Logo_m55w9k.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152735/Juice_Logo_dbz72s.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152729/Killer_Brew_Logo_pwwfrf.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152730/Punch_Logo_y4elds.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152730/Rehab_Logo_ylgxq2.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759166467/Monster_Reserve_tzktxy.png",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152731/Super_Fuel_Logo_quhxbd.webp",
    "https://res.cloudinary.com/dqtrha0hz/image/upload/v1759152732/Ultra_Logo_vsals9.webp",
  ];

  const logos = Categories.map((category, i) => ({
    category,
    url: logosImg[i],
  }));

  useEffect(() => {
    const fetchMonsters = async () => {
      try {
        setLoading(true);

        const monsters = await apiFetch<MonsterDto[]>(`monsters`, "GET");
        setMonster(monsters as MonsterDto[]);

        const sections: Section<MonsterDto>[] = Categories.map((cat) => ({
          id: cat,
          title: cat,
          items: monsters.filter((m) => m.category === cat),
        }));

        setSection(sections);
      } catch (error: any) {
        console.error("Errore nel recupero delle monster:", error);
        setError("Impossibile caricare le monster");
      } finally {
        setLoading(false);
      }
    };

    fetchMonsters();
  }, []);

  return (
    <>
      <Container>
        {loading && <p>Caricamento in corso...</p>}
        {error && <p>{error}</p>}

        <div className="mb-5">
          <Row className="d-flex justify-content-center align-items-center mb-3">
            {logos.map(({ category, url }) => (
              <Col
                key={category}
                xs={5}
                md={4}
                lg={2}
                className="ms-2 me-3 mb-2"
              >
                <Image
                  src={url}
                  alt={`Logo ${category}`}
                  width="200px"
                  className="pointer monster-img"
                  onClick={() => {
                    const el = document.getElementById(category);
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>

        {section.map((sec) => (
          <div
            key={sec.title}
            id={sec.title}
            className="mb-4 monster-bold text-white"
          >
            <h2 className="p-2 fs-1 border-bottom border-3 border-m-tertiary">
              <span>{sec.title}</span>
            </h2>
            <div className="d-flex flex-wrap gap-3 p-4 pb-3">
              {sec.items.map((monster) => (
                <Card
                  key={monster.id}
                  style={{ width: "6rem" }}
                  className="bg-none"
                >
                  <Card.Img
                    variant="top"
                    src={monster.imageUrl}
                    className="pointer monster-img"
                    onClick={() => navigate(`/monsters/${monster.id}/details`)}
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Container>
    </>
  );
};

export default HomePageComponent;

import { Container, Row, Col, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Github, Linkedin, Instagram } from "react-bootstrap-icons";
import "../style/footer.scss";

const FooterComponent: React.FC = () => {
  return (
    <>
      <Container fluid className="bg-m-dark-gray p-4 text-m-white">
        <Row className="mb-4">
          <Col
            sm={12}
            md={12}
            lg={12}
            className="d-flex align-items-center justify-content-center"
          >
            <Image
              src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1756132168/Monsterpedia_Logo_oaanuz.png"
              alt="Monsterpedia_Logo"
              style={{ width: "30px", height: "auto" }}
            ></Image>

            <p className="m-0 mx-3">
              Monsterpedia&trade; - 2025 - by Marcello Miranda
            </p>

            <Image
              src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1756132168/Monsterpedia_Logo_oaanuz.png"
              alt="Monsterpedia_Logo"
              style={{ width: "30px", height: "auto" }}
            ></Image>
          </Col>
        </Row>

        <Link
          to="https://github.com/MarcyMiranda2004"
          className="custom-link mb-1 rounded-circle"
          target="_blank"
        >
          <Github size={22} className="mx-2" />
        </Link>

        <Link
          to="www.linkedin.com/in/marcello-miranda-04-na"
          className="custom-link my-1 rounded-circle"
          target="_blank"
        >
          <Linkedin size={22} className="mx-2" />
        </Link>

        <Link
          to="https://www.instagram.com/marxeline_04/"
          className="custom-link my-1 rounded-circle"
          target="_blank"
        >
          <Instagram size={22} className="mx-2" />
        </Link>
      </Container>
    </>
  );
};

export default FooterComponent;

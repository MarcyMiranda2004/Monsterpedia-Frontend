import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
      <img
        src="https://res.cloudinary.com/dqtrha0hz/image/upload/v1756132168/Monsterpedia_Logo_oaanuz.png"
        alt="404"
        style={{ width: "300px" }}
      />

      <div className="d-flex flex-column align-items-center justify-content-center mb-3">
        <h1 className="monster text-m-quaternary">Not Found</h1>
        <h2 className="lbr text-m-quaternary">404</h2>
        <p className="text-warning">
          La pagina che stai cercando potrebbe esse inesistente o attualmente
          non disponibile, riprova più tardi
        </p>
      </div>
      <Link to="/home" className="text-m-secondary">
        Torna alla home
      </Link>
    </Container>
  );
};

export default NotFoundPage;

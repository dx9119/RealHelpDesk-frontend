import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import Logout from "../components/auth/Logout";

function Header() {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
        rel="stylesheet"
      />

      <Navbar bg="light" expand="md" className="shadow-sm" style={{ fontFamily: "Inter, sans-serif" }}>
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
            🐰 RealHelpDesk
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto">
            <Nav.Item>
              <Nav.Link as={Link} to="/portal-manager">Порталы</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/tickets-my">Поиск по заявкам</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/profile">Мой профиль</Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/notify-settings">Уведомления</Nav.Link>
            </Nav.Item>

          </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;

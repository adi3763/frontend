import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../../assets/images/logo-white.png'; // adjust if needed
import './NavbarComponnent.css'; // hover styles below

function NavbarComponent() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar expand="lg" bg="dark" data-bs-theme="dark" className="py-2 sticky-top shadow-sm">
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <img
              src={logo}
              alt="Logo"
              height="34"
              className="me-2"
              style={{ objectFit: 'contain' }}
            />
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            {/* Left nav */}
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              <Nav.Link as={Link} to="/men" className="px-3 fs-5">
                Men
              </Nav.Link>
              <Nav.Link as={Link} to="/women" className="px-3 fs-5">
                Women
              </Nav.Link>
              <Nav.Link as={Link} to="/kids" className="px-3 fs-5">
                Kids
              </Nav.Link>
            </Nav>

            {/* Right icons */}
            <Nav className="ms-auto my-2 my-lg-0" navbarScroll>
              <button
                type="button"
                className="btn btn-link nav-icon-btn me-3"
                aria-label="Account"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="26"
                  viewBox="0 0 16 16"
                  className="nav-icon"
                >
                  <path
                    fill="currentColor"
                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"
                  />
                </svg>
              </button>

              <button
                type="button"
                className="btn btn-link nav-icon-btn me-lg-2"
                aria-label="Cart" onClick={() => {navigate('/shop')}}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="26"
                  viewBox="0 0 16 16"
                  className="nav-icon"
                >
                  <path
                    fill="currentColor"
                    d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1m3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"
                  />
                </svg>
              </button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>


    </>
  );
}

export default NavbarComponent;

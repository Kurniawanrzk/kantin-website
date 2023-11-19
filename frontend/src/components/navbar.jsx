import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";

export default function Nav({ onLogout }) {
  const loggedIn = localStorage.getItem("isLoggedIn");

  const getUserData = () => {
    try {
      let data = JSON.parse(localStorage.getItem("user"));
      return <>{data.name}</>;
    } catch (err) {
      return <></>;
    }
  };

  return (
    <Navbar style={{ backgroundColor: "#0e273c" }} data-bs-theme="dark">
      <Container fluid="md">
        <Navbar.Brand href="/">Kantin</Navbar.Brand>
        <Navbar.Toggle />

        {loggedIn ? (
          <>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                Signed in as: <a href="#login">{getUserData()}</a>
              </Navbar.Text>
            </Navbar.Collapse>
            <Button variant="light" className="ms-4" onClick={onLogout}>
              Logout
            </Button>

          </>
        ) : (
          <>
            <Navbar.Collapse className="justify-content-end">
              <Navbar.Text>
                You are not login yet, Login if you want to use the app.
              </Navbar.Text>
            </Navbar.Collapse>
            <a href="/login" className="ms-4 btn btn-light">
              Login
            </a>
          </>
        )}
      </Container>
    </Navbar>
  );
}

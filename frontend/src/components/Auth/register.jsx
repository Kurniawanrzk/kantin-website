import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "../url";
export default function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [username, setUsername] = useState();
  const [name, setName] = useState();
  const [err, setErr] = useState(false);
  let Navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) Navigate("/", { state: 112 }); // 112 mean already Log in
  }, []);
  const register = async (e) => {
    e.preventDefault();
    let data = JSON.stringify({
      email: email,
      password: password,
      username: username,
      name: name,
    });

    let config = {
      method: "post",
      url: `${URL}/api/v1/auth/register`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios.request(config).then((response) => {
      setErr(false);
      Navigate("/login", { state: 123 }).catch(() => {
        setErr(true);
      });
    });
  };
  return (
    <>
      <Container className="container">
        <Row
          style={{ height: "60vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Col className="p-4 border shadow-sm" md={4}>
            {err ? <Alert variant={"danger"}>Something wrong</Alert> : <></>}
            <InputGroup className="mb-3">
              <InputGroup.Text id="Usn-ipt">A</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="Usn-ipt"
                onChange={(e) => setUsername(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="Name-ipt">@</InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Full-Name"
                aria-label="Name"
                aria-describedby="Name-ipt"
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="Email-ipt">@</InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Email"
                aria-label="Email"
                aria-describedby="Email-ipt"
                onChange={(e) => setEmail(e.target.value)}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text id="Email-ipt">*</InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Password"
                aria-label="Password"
                aria-describedby="Email-ipt"
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
            <div className="d-grid">
              <button
                onClick={register}
                className="btn text-white"
                style={{ backgroundColor: "#0e273c", fontSize: "20px" }}
              >
                Register
              </button>
            </div>
            <hr />
            <a
              className="btn text-white"
              href="/login"
              style={{ backgroundColor: "#406119" }}
            >
              Log In
            </a>
          </Col>
        </Row>
      </Container>
    </>
  );
}


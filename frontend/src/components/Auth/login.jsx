import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import LoadingSpiner from "../../assets/Spinner_font_awesome.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { URL } from "../url";
export default function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [err, setErr] = useState(false);
  const [load, setLoad] = useState(false);
  const Location = useLocation();
  let Navigate = useNavigate();
  const [justRegister, setJustRegister] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("isLoggedIn")) Navigate("/", { state: 112 }); // 112 mean already Log in
    if (Location.state == 123) setJustRegister(true);
  }, []);

  const login = async (e) => {
    e.preventDefault();
    setLoad(true);
    let data = JSON.stringify({
      email: email,
      password: password,
    });

    let config = {
      method: "post",
      url: `${URL}/api/v1/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    await axios
      .request(config)
      .then((response) => {
        setErr(false);
        setLoad(false);
        localStorage.setItem("acess_token", JSON.stringify(response.data));
        localStorage.setItem("isLoggedIn", 1);
        Navigate("/", { state: 111 }); // 111 mean just log in
      })
      .catch((error) => {
        console.log(error);
        setErr(true);
        setLoad(false);
      });
  };

  return (
    <>
      {localStorage.getItem("isLoggedIn") ? (
        <></>
      ) : (
        <Container className="container">
          <Row
            style={{ height: "60vh" }}
            className="d-flex justify-content-center align-items-center"
          >
            <Col className="p-4 border shadow-sm" md={4}>
              {err ? (
                <Alert variant={"danger"}>Your password or email wrong!</Alert>
              ) : (
                <></>
              )}
              {justRegister ? (
                <Alert variant="success">
                  Register successfully, please log in
                </Alert>
              ) : (
                <></>
              )}
              <Form>
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
              </Form>
              <div className="d-grid">
                <button
                  onClick={login}
                  className="btn text-white"
                  style={{ backgroundColor: "#0e273c", fontSize: "20px" }}
                >
                  {load ? (
                    <img
                      width={20}
                      className="spinner-logo"
                      src={LoadingSpiner}
                    />
                  ) : (
                    <>Log In</>
                  )}
                </button>
              </div>
              <hr />
              <a
                href="/register"
                className="btn text-white"
                style={{ backgroundColor: "#406119" }}
              >
                Create New Account
              </a>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
}

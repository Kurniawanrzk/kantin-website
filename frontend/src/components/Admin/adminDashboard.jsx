import Container from "react-bootstrap/esm/Container";
import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";
import Col from "react-bootstrap/esm/Col";
// import Row from "react-bootstrap/esm/Row"
import Modal from "react-bootstrap/Modal";
import Nav from "../navbar";
import axios from "axios";
import InputGroup from "react-bootstrap/InputGroup";
import { URL } from "../url";
// import Form from 'react-bootstrap/Form';
import { useState, useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  useEffect(() => {
    get_all_user_transaction();

    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      get_all_user_transaction();
    }, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Untuk menyimpan entries transaksi user
  const [allUserTransaction, setAllUserTransaction] = useState({
    data: [],
    loading: true,
    supportedValue: null,
  });
  const [showModal, setShowModal] = useState({ show: false, ref: null });
  const [statusTransaction, setStatusTransaction] = useState(null);
  const [messageTransaction, setMessageTransaction] = useState(null);
  const [queryParams] = useSearchParams();
  const Navigate = useNavigate();

  // Untuk memanggil api entries transaksi user
  const get_all_user_transaction = async () => {
    let query = `?search=${queryParams.get("search")}`;
    await axios
      .get(
        `${URL}/api/v1/admin/transaction${
          queryParams.get("search") ? query : ""
        }`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("acess_token")).token
            }`,
          },
        }
      )
      .then((res) => {
        if (res.data.message !== "No data entries") {
          setAllUserTransaction({ data: res.data, loading: false });
          console.log(res.data);
        } else {
          setAllUserTransaction({ data: [], loading: false });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // Untuk mengupdate status
  const change_status = async (checkout_id) => {
    let data = JSON.stringify({
      status: statusTransaction,
      message: messageTransaction,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${URL}/api/v1/admin/transaction/${checkout_id}`,
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("acess_token")).token
        }`,
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setShowModal({ show: false, ref: null, supportedValue: null });
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTransactionById = async (checkout_id) => {
    let config = {
      method: "delete",
      maxBodyLength: Infinity,
      url: `${URL}/api/v1/transaction/${checkout_id}`,
      headers: {
        Authorization: `Bearer ${
          JSON.parse(localStorage.getItem("acess_token")).token
        }`,
      },
    };

    axios
      .request(config)
      .then(() => {
        get_all_user_transaction();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <Nav />
      <Modal
        show={showModal.show}
        backdrop="static"
        onHide={() =>
          setShowModal({ show: false, ref: null, supportedValue: null })
        }
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {showModal.ref == "change-status"
              ? "Change Status Transaction"
              : ""}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <InputGroup className="mb-3">
            <InputGroup.Text id="Email-ipt">Status</InputGroup.Text>
            <select
              className="form-control"
              onChange={(e) => setStatusTransaction(e.target.value)}
            >
              <option>--- Silahkan Pilih Status ---</option>
              <option value={"Accept"}>Accept</option>
              <option value={"Process"}>Process</option>
              <option value={"Unpaid"}>Unpaid</option>
              <option value={"Finish"}>Finish</option>
              <option value={"Decline"}>Decline</option>
            </select>
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text id="Email-ipt">Message</InputGroup.Text>
            <input
              onChange={(e) => setMessageTransaction(e.target.value)}
              placeholder="contoh: Bukti pembayaran diterima"
              className="form-control"
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={(e) => change_status(e.target.value)}
            value={showModal.supportedValue}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Container className="mt-4">
        <Col className="head-of-admin">
          <h2>Admin Dashboard</h2>
        </Col>
        <Col>
          <div className="d-flex gap-3 m-3">
            <form>
              <input
                name="search"
                placeholder="Search, Press enter"
                type="search"
                className="form-control"
              />
            </form>
            <div>
              <Button onClick={() => Navigate("/product")}>
                List of Product
              </Button>
            </div>
          </div>
          <Table responsive bordered striped>
            <thead>
              <tr>
                <th>#</th>
                <th>Transaction</th>
                <th>Uplode Bukti Pembayaran</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {allUserTransaction.data.map((val, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>
                    <div className="mb-3">
                      ID transaksi : {val.checkout_id} | {val.transaction_date}
                      <br />
                      Nama : {val.user.name}
                      <br />
                      Username : {val.user.username}
                      <br />
                      Email : {val.user.email}
                    </div>
                    <div>
                      {val.transaction.map((val, idx) => (
                        <>
                          <div className="mb-3 d-flex gap-2" key={idx}>
                            <div>
                              <img src={val.product_image} width={100} />
                            </div>
                            <div>
                              <p className="m-0">{val.product}</p>
                              <p className="m-0">quantitiy : {val.qty}</p>
                              <p className="m-0">Rp. {val.product_price}</p>
                            </div>
                          </div>
                        </>
                      ))}
                      <hr />
                      <p>Total : {val.price}</p>
                    </div>
                  </td>
                  <td>
                    {val.img_transaction == "None" ? (
                      <>
                        <p className="text-danger">
                          Belum mengupload bukti pembayaran
                        </p>
                      </>
                    ) : (
                      <img width={100} src={val.img_transaction} />
                    )}
                  </td>
                  <td>
                    <Button
                      className={
                        val.status == "Unpaid"
                          ? "btn btn-danger"
                          : val.status == "Process"
                          ? "btn btn-primary"
                          : "btn btn-success"
                      }
                    >
                      {val.status}
                    </Button>
                  </td>
                  {val.transaction_id}
                  <td>
                    <Button
                      onClick={() =>
                        setShowModal({
                          show: true,
                          ref: "change-status",
                          supportedValue: val.checkout_id,
                        })
                      }
                      variant="success"
                    >
                      Change Status
                    </Button>{" "}
                    <Button
                      onClick={() => deleteTransactionById(val.checkout_id)}
                      variant="danger"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Container>
    </>
  );
}

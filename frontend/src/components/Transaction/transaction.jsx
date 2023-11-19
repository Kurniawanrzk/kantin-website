import Nav from "../navbar"
import axios from "axios";
import { useEffect, useState } from "react";
// import Col from "react-bootstrap/esm/Col";
import Table from 'react-bootstrap/Table';
import Button from "react-bootstrap/esm/Button";
import FormData from 'form-data'
import qrisdummy from "../../assets/qris-dummy.png"
import {
    useNavigate
} from 'react-router-dom'
import Modal from 'react-bootstrap/Modal';
import { URL } from "../url";

export default function Transaction() {
    const [dataTransaction, setDataTransaction] = useState({data:[], status:false});
    const [showModel, setshowModel] = useState({show:false, ref:null})
    const [struk, setStruk] = useState(null)
    
    useEffect(() => {
        // Fetch initial data
    getAllTransaction();
    // Set up interval for real-time updates
    const intervalId = setInterval(() => {
      getAllTransaction();
    }, 2000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId); 
    }, [])
    const Navigate = useNavigate()
    const onLogout = async () => {
        await axios.post(
            `${URL}/api/v1/auth/logout?token=${
              JSON.parse(localStorage.getItem("acess_token")).token
            }`,
            {
              headers: {
                Accept: "application/json",
              },
            }
            ).then((res) => {
              localStorage.removeItem("isLoggedIn")
              localStorage.removeItem("acess_token")
              localStorage.removeItem("user")
                console.table(res.data)
                Navigate("/");
            })
          .catch((err) => {
            console.log(err)
          });
      };
    const uploadsButkiPembayaran = async( e ,checkout_id) => {
      let data = new FormData();
      console.log(e.target.files[0])
      data.append('bukti_image_file', e.target.files[0]);
      
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${URL}/api/v1/payment/bukti/${checkout_id}`,
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("acess_token")).token
          }`,
          // Set the Content-Type header manually for form data
          "Content-Type": "multipart/form-data",
        },
        data: data,
      };

      axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });

    }

    const getStruk = async(checkout_id) => {
      setshowModel({show:true, ref:"struk"})
      await axios.get(
        `${URL}/api/v1/struk/${checkout_id}`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("acess_token")).token
            }`
          },
        }
    ).then((res) => {
        setStruk(res.data)
        console.log(res.data)
    })
    }
    const getAllTransaction = async() => {
        await axios.get(
            `${URL}/api/v1/transaction?token=${
              JSON.parse(localStorage.getItem("acess_token")).token
            }`,
            {
              headers: {
                Accept: "application/json",
              },
            }
        ).then((res) => {
          if(res.data.message !== "No data entries") {
            console.log(res.data)
              setDataTransaction({ data:res.data, status:true })
            } else {
              setDataTransaction({ data:[], status:"no-data" })
            }
        })}
    const deleteTransactionById = async(checkout_id) => {

      let config = {
        method: 'delete',
        maxBodyLength: Infinity,
        url: `${URL}/api/v1/transaction/${checkout_id}`,
        headers: { 
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("acess_token")).token
          }`        }
      };
      
      axios.request(config)
      .then(() => {
        getAllTransaction()
      })
      .catch((error) => {
        console.log(error);
      });
      

    }
    return(
        <>
        <Modal
        show={showModel.show}
        backdrop="static"
        onHide={() => setshowModel({show:false, ref:null})}
        keyboard={false}
        >
         <Modal.Header closeButton>
          <Modal.Title>{showModel.ref == "payment method" ? "Qris" : "Bukti Struk"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showModel.ref == "payment method" ? <>
          <div className="text-center"><img src={qrisdummy} width={250} /></div>
          </> : <>
          {struk == null ? <>Silahkan Bayar Terlebih Dahulu Agar Struk Keluar</> : <>
            <p className="m-0">ID TRANSAKSI : {struk.checkout_id}</p>
            <p className="m-0">STATUS : {struk.status}</p>
            <p className="m-0">NAME : {struk.buyer.name}</p>
            <p className="m-0">USERNAME : {struk.buyer.username}</p>
            <hr/>
            <p className="m-0">Produk Yang Di Beli</p>
            {struk.transaction.map((val) => (
              <>
              {val.product.map((val) => (
               <>
                <p className="m-0">{val.product_name} | Rp. {val.price}</p>
               </>
              ))}
              </>
            ))
            }
            ----------------------------------------------
            <p>Total : {struk.price}</p>
          </>}
          </>}
        </Modal.Body>
        <Modal.Footer>
         
        </Modal.Footer>
      </Modal>
        <Nav onLogout={onLogout} />
              <Table responsive striped bordered >
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Transaction</th>                 
                    <th>Uplode Bukti Pembayaran</th>
                    <th>Status</th>
                    <th>Struk</th>
                    <th>Message</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                {dataTransaction.data.map((val, idx) => (
                    <tr  key={idx}> 
                       <td>{idx + 1}</td>
                        <td>
                          <div className="mb-3">ID transaksi : {val.checkout_id} | {val.transaction_date}</div>
                          <div>
                            {
                              val.transaction.map((val, idx) => (
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
                              ))
                            }
                            <hr/>
                            <p>Total : {val.price}</p>
                          </div>

                        </td>
                        <td>{val.img_transaction == "None" ? <>
                        <input type="file" onChange={(e) => uploadsButkiPembayaran(e, val.checkout_id)} style={{width:""}} className="form-control" />
                        </> : <img  width={100} src={val.img_transaction} />}
                        </td>
                        <td><Button className={val.status == "Unpaid" ? "btn btn-danger" : val.status == "Process" ? "btn btn-primary" : "btn btn-success"}>{val.status}</Button></td>{val.transaction_id}
                        <td><Button onClick={() => getStruk(val.checkout_id)}  variant="warning">Bukti Struk</Button></td>
                        <td>{val.message == null ? "Belum ada message dari admin" : val.message}</td>
                        <td><Button onClick={() => setshowModel({show:true, ref:"payment method"})} variant="success">QRIS</Button> <Button onClick={() => deleteTransactionById(val.checkout_id)} variant="danger">Delete</Button></td>      
                    </tr>
                ))}
                </tbody>
              </Table>
        </>  
    )
}

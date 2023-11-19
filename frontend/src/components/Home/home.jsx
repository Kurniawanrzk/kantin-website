import cart from "../../assets/cart.svg";
import pemesanan from "../../assets/pemesanan.svg";
import admin from "../../assets/admin.svg";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/esm/Col";
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Swal from 'sweetalert2'
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Nav from "../navbar";
import { URL } from "../url";

export default function Home() {
  
  let Navigate = useNavigate()
  const [product, setProduct] = useState({ data: [], status: false });
  let dataCarts = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("carts")) : []
  const [showCart, setShowCart] = useState(false);
  const handleClose = () => {
    setShowCart(false)
    setCartProduct([])
  }
  const handleShow = () => setShowCart(true);
  const [alert, setAlert] = useState({status:false, message:""})
  const [cartProduct, setCartProduct] = useState([])
  
  const SwalS = (title, text, icon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'Yes'
    })
  }
  useEffect(() => {
    if(localStorage.getItem("isLoggedIn")) {
      Me()
      if(!localStorage.getItem("carts")) {
        localStorage.setItem("carts", JSON.stringify([]))
      }
    }
    getProduct();
  }, []);

  const createTransaction = async() => {
    if(cartProduct.length == 0) {
      SwalS("Pemberitahuan", "Centang terlebih dahulu produk yang ingin dipesan", "info" )

    } else {
    let data = {data_transaction : []}
    cartProduct.forEach((val) => {
      data.data_transaction.push({
        product_id:dataCarts[val].product_id,
        qty:dataCarts[val].qty
      })
    })
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}/api/v1/transaction/`,
      headers: { 
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("acess_token")).token}`,
        'Content-Type': 'application/json'
      },
      data : JSON.stringify(data)
    };

    console.log(data)
    axios.request(config)
    .then(() => {
      cartProduct.forEach((val) => {
        let dataCartsTempt = JSON.parse(localStorage.getItem("carts"))
        dataCartsTempt.splice(val, 1)
        localStorage.setItem("carts", JSON.stringify(dataCartsTempt))
        Navigate("/transaction")
      })
    })
    .catch((err) => {
      console.log(err);
      
    });

  }
  }

  const Me = async () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${URL}/api/v1/auth/me`,
      headers: { 
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("acess_token")).token}`,
        "Accept": "application/json"
      }
    };

    await axios.request(config)
    .then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data))
    })
    .catch((err) => {
      console.log(err)
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("acess_token")
      localStorage.removeItem("user")
    });

  };
  
  const getProduct = async () => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${URL}/api/v1/product`,
    };

    await axios
      .request(config)
      .then((res) => {
        setProduct({ data: res.data, status: true });
      })
      .catch((error) => {
        console.log(error);
      });
  };


  const addToCart = (e, product, qty, product_id, product_image, price) => {
    const qtys = document.querySelector(qty)
    const carts = JSON.parse(localStorage.getItem("carts"))
    if(carts.length > 10) {
      SwalS("Pemberitahuan", "Produk di cart tidak bisa lebih dari 10", "info" )
    } else if(qtys.value < 1) {
      SwalS("Pemberitahuan", "Silahkan Masukkan jumlah produk", "info" )
    } else {
      let sd = carts.filter((val) => val.product == product)
      if(sd.length != 0) {
        SwalS("Pemberitahuan", "Product tersebut sudah ada dicart", "info" )
      } else {
      carts.push({
        product:product,
        qty:qtys.value,
        product_id:product_id,
        product_image:product_image,
        price:price
      })
      
      localStorage.setItem("carts", JSON.stringify(carts))
      SwalS("Pemberitahuan", "Product berhasil masuk ke cart", "info" )
      }
    }
    
   
    
  };
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

  const activateBtn = (e) => {
    if (e.target.value < 0) {
      e.target.value = 0;
    } else if (e.target.value > 5) {
      e.target.value = 5;
    }
  };
  
  const addTransaction = (e) => {
    if(e.target.checked) {
      setCartProduct(prev => [...prev, e.target.value])
    } else if(!e.target.checked){
      cartProduct.splice(cartProduct.indexOf(e.target.value), 1)
      setCartProduct(cartProduct)
       
    }
  }
  return (
    <>
          <Nav onLogout={onLogout} />

       {localStorage.getItem("isLoggedIn") && localStorage.getItem("user")  ?    <Modal
        show={showCart}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Carts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {dataCarts !== null ? dataCarts.map((val, idx) => (
           <>
           
            <div className="d-flex gap-5">
            <div className="d-flex align-items-center ms-4">
            <input
            type="checkbox"
            onClick={e => addTransaction(e)}
            value={idx}
            />
            </div>
            <img width={100} src={val.product_image} />
            <div>
            <p>{val.product} (Rp. {val.price})</p>
            <p>Quantitiy : {val.qty}</p>
            </div>
            </div>
            <input type="hidden" value={val.product_id} />
            <input type="hidden" value={val.qty} />
            <hr/>
           </>
          )) : <>No product</>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={createTransaction}>Proccess</Button>
        </Modal.Footer>
      </Modal> : <></>  }

        {alert.status ? <div className="alert-container p-3">
          <Alert style={{ width:"fit-content" }} className="d-flex justify-content-between" variant="danger">
          <span>{alert.message}</span> 
          <span className="ms-4" onClick={() => setAlert({status:false, message:""})} style={{ cursor:"pointer" }}>X</span></Alert>
        </div> : <></>}
        
      {localStorage.getItem("isLoggedIn") ? <div
        className="cart-container m-3 d-flex gap-3"
  
      >
          {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).admin ? 
          <a href="/admin"
          className="cart border rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: "50px", height: "50px", backgroundColor: "#0e273c" }}
        >
          <img width={20} src={admin} />
        </a> : <></>}
         <a href="/transaction"
          className="cart border rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: "50px", height: "50px", backgroundColor: "#0e273c" }}
        >
          <img width={20} src={pemesanan} />
        </a>
        <div
          onClick={handleShow}
          className="cart border rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: "50px", height: "50px", backgroundColor: "#0e273c" }}
        >
          <img width={20} src={cart} />
        </div>
      </div>: <></>}
      <Container className="mt-5">
           {localStorage.getItem("isLoggedIn") ? 
            <div className="d-flex justify-content-center">
            <Alert style={{width:"fit-content"}}>
              {localStorage.getItem("user") && JSON.parse(localStorage.getItem("user")).admin ? 
              <>Selamat datang Admin!, Silahkan click logo kunci untuk masuk ke dashboard admin</> : 
              <>Selamat datang, silahkan pilih makanan / minuman yang diinginkan beserta jumlahnya.
              setelah itu buka logo keranjang belanja dibawah kanan untuk proses pemesanan/transaksi</>}
            </Alert>
            </div> : <></>}
        <Col>
            <h3 className="text-center mb-5">List Product</h3>
          <Col className="product-container" style={{paddingBottom:"100px"}}

          >
            {product.data.map((val, idx) => (
              <Card key={idx} style={{ width: "18rem" }}>
                <Card.Img variant="top" src={val.product_image} />
                <Card.Body>
                  <Card.Title>
                    {val.product_name} (Rp. {val.price}){" "}
                  </Card.Title>
                  <Card.Text>{val.product_type}</Card.Text>
                  {localStorage.getItem("isLoggedIn") ? <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 60px",
                      gap: "20px",
                    }}
                  >
                    <Button
                    
                      className={`btn-addtocart-${idx}`}
                      variant="primary"
                      onClick={(e) => addToCart(e,val.product_name, `.qty-${idx}`, val.product_id, val.product_image, val.price)}
                    >
                      Add to cart
                    </Button>
                    <input
                      type="number"
                      defaultValue={0}
                      className={`qty-${idx} form-control`}
                      onChange={(e) => activateBtn(e)}
                    />
                  </div> : <></>}
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Col>
      </Container>
    </>
  );
}

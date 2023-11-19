import Button from "react-bootstrap/esm/Button"

export default function LoadingAdminDashboard() {
    return (
        <tr className="sdsd"> 
                       <td>1</td>
                        <td>
                          <div className="mb-3">asda</div>
                          <div>
                         
                                
                                <div className="mb-3 d-flex gap-2">
                                    <div>
                                      {/* <img src={val.product_image width={100} /> */}
                                    </div>
                                    <div>
                                      <p className="m-0">val.product</p>
                                      <p className="m-0">quantitiy : val.qty</p>
                                      <p className="m-0">Rp. val.product_price</p>
                                    </div>
                                </div>
                            
                            <hr/>
                            <p>Total : </p>
                          </div>

                        </td>
                        <td> 
                        <p>Belum mengupload bukti pembayaran</p>
                        
                        </td>
                        <td><Button >s</Button></td>
                        <td><Button  variant="warning">Bukti Struk</Button></td>
                        <td><Button  variant="success">Change Status</Button> <Button variant="danger">Delete</Button></td>                          
                    </tr>
    )
}
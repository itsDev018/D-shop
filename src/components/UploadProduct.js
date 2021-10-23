import React, { Component } from 'react';
import './UploadProduct.css';
import { Redirect } from 'react-router-dom';

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

export default class UploadProduct extends Component{

  state = {
    dshop: null,
    account: '',
    productName:'',
    productDescription: '',
    productPrice: 0,
    redirect: false
  }

  constructor(props) {
    super(props);

    this.state = { dshop: this.props.contract, account: this.props.account };
  }

  handleOnChange = e => {
    this.setState({ [e.target.name] : e.target.value });
  }

  handleFileChange = e => {
    const file = e.target.files[0];
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        productImage: Buffer(reader.result),
      });
    }
  }

  handleOnSubmit = e => {
    e.preventDefault();

    //Upload product image to IPFS
    ipfs.add(this.state.productImage, (error, result) => {
      if(error) {
        console.log('error')
        return
      }

      this.state.dshop.methods.uploadProduct(result[0].hash, this.state.productName, this.state.productDescription,
                                              parseInt(this.state.productPrice))
                                .send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         productDescription: '',
         productName: '',
         productPrice: 0,
         redirect: true
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
      })
    });
  }

  render(){
    //Redirect to Home when the product has been uploaded
    if(this.state.redirect) return <Redirect to="/" />

    return(
      <div className="col-md-6 offset-md-3">
        <div id="upload-form" className="card card-body">
          <h4 className="card-title">Upload a product</h4>
          <hr></hr>
          <p className="card-text text-muted">Here you'll be able to upload a product in a blockchain
                                  in an easy, safe and descentralized way :)</p>
          <form onSubmit={this.handleOnSubmit}>

            <div className="input-group mb-3">
              <input type="text" name="productName" className="form-control" placeholder="Product name"
                 value={this.state.productName} onChange={this.handleOnChange} required/>
            </div>

            <div className="input-group mb-3">
              <textarea className="form-control" placeholder="Description" name="productDescription"
                    onChange={this.handleOnChange} value={this.state.productDescription} required ></textarea>
            </div>

            <div className="input-group mb-3">
              <input type="number" name="productPrice" min="1" className="form-control" placeholder="$"
                 value={this.state.productPrice} onChange={this.handleOnChange} required/>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="imageField">Product image</label>
              <br></br>
              <input type="file" className="form-control-file" onChange={this.handleFileChange} id="imageField"/>
            </div>

          <button type="submit" className="btn">Upload my product</button>
        </form>
      </div>
    </div>
    )
  }
}

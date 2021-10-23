import React, { Component } from 'react';
import  moment from 'moment';
import './Home.css';
const CoinGecko = require('coingecko-api');

export default class Home extends Component{

  state = {
    products: [],
    manageEth: null
  }

  //Format product price in USD
  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  constructor(props) {
    super(props);

    //Set web3 in Home component
    this.state = { products: this.props.products, web3: this.props.web3, account: this.props.account };
  }

  buyProduct = async product => {
    //Get Ethereum price in USD
    const cryptoAPI = new CoinGecko();

    const ethereumCoin = await cryptoAPI.coins.fetch('ethereum', {});
    const ethereumPriceUSD = ethereumCoin.data.market_data.current_price.usd;

    const productPriceETH = parseInt(product.productPrice) / ethereumPriceUSD;
    
    await this.state.web3.eth.sendTransaction
      ({from: this.state.account, to:product.productOwner, value: this.state.web3.utils.toWei(String(productPriceETH), "ether")})
  }

  render(){
    return(
      <div className="row">
          {
            this.state.products.map((product, key) => {
              return(
                <div className="col-md-6 p-2" key={key}>
                  <div id="product-card" className="card">
                    <img src={"https://ipfs.infura.io/ipfs/" + product.productHash} className="card-img-top" alt="Oops nothing to show here :("/>
                    <div className="card-header card-body">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text">{product.productDescription}</p>
                      <p className="card-text">{this.formatter.format(product.productPrice)}</p>
                      <p className="card-text text-muted">{product.productOwner}</p>
                      <button type="text" onClick={() => this.buyProduct(product)} className="btn">Buy product!</button>
                    </div>
                    <div className="card-footer text-muted">
                      {moment.unix(product.uploadTime).format('h:mm:ss A M/D/Y')}
                    </div>
                  </div>
                </div>
              )
            })
          }

      </div>
    )
  }
}

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Web3 from 'web3';
import DShop from './abis/DShop.json';
import Navigation from './components/Navigation';
import Home from './components/Home';
import UploadProduct from './components/UploadProduct';

class App extends Component {

  state = {
    account: '',
    dshop: null,
    products: [],
    loading: true
  }

  async componentDidMount(){
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser connected, try installing MetaMask :)');
    }
  }

  async loadBlockchainData() {
    const web3 = (window.web3) ? window.web3 : null;

    if( web3 ){
      //For pass web3 to Home component
      this.setState({ web3 });

      const accounts = await web3.eth.getAccounts();
      this.setState({ account: accounts[0] });

      const networkId = await web3.eth.net.getId();
      const networkData = DShop.networks[networkId];

      if(networkData) {
        const dshop = new web3.eth.Contract(DShop.abi, networkData.address);
        this.setState({ dshop });

        const productsCount = await dshop.methods.productCounter().call();
        this.setState({ productsCount });

        //Get all products storaged in the blockchain
        for (let i = productsCount; i >= 1; i--){
          const product = await dshop.methods.products(i).call();
          this.setState({
            products: [...this.state.products, product]
          });
        }

      } else {
        window.alert('DShop contract deployed failed');
      }


      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Router>
        <Navigation account={this.state.account}/>

        <div className="container p-4">
          { this.state.loading
            ?
             <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
            :
             <Route path="/" exact>
                <Home products={this.state.products} web3={this.state.web3} account={this.state.account}/>
              </Route>

          }
          <Route path="/upload-product">
            <UploadProduct contract={this.state.dshop} account={this.state.account}/>
          </Route>
        </div>
        <footer>
          <div class="text-center p-1">
             2021:
            <a class="text-reset text-decoration-none fw-bold" target="_blank" rel="noreferrer"
               href="https://github.com/itsDev018"> © Mario Fernandez</a>
          </div>
        </footer>
      </Router>

    );
  }
}

export default App;

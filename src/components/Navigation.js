import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

export default class Navigation extends Component{
  render(){
    return(
      <nav id="navbar" className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/" >
          Decentralized Store
        </Link>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Shop</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/upload-product">Upload product</Link>
            </li>
            <li className="nav-item">
              <small>
                  <a target="_blank" alt="" className="nav-link active"
                     rel="noopener noreferrer"
                     href={"https://etherscan.io/address/"+ this.props.account}>
                     {/*Display user account number*/}
                    {this.props.account ? this.props.account.substring(0,6) : '0x0'}...{this.props.account ? this.props.account.substring(38,42) : '0x0'}
                  </a>
              </small>
            </li>
          </ul>
        </div>
      </nav>
    )
  }
}

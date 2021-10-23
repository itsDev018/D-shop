// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

contract DShop {
  uint public productCounter = 0;

  struct Product{
    uint productId;
    string productHash;
    string productName;
    string productDescription;
    uint productPrice;
    uint uploadTime;
    address payable productOwner;
  }

  event ProductUploaded(
    uint productId,
    string productHash,
    string productName,
    string productDescription,
    uint productPrice,
    uint uploadTime,
    address payable productOwner
  );

  mapping(uint => Product) public products;

  function uploadProduct(string memory _productHash, string memory _productName,
                         string memory _productDescription, uint _productPrice) external{
    require(bytes(_productHash).length > 0);
    require(bytes(_productName).length > 0);
    require(bytes(_productDescription).length > 0);

    productCounter ++;

    products[productCounter] = Product(productCounter, _productHash, _productName, _productDescription,
                                       _productPrice, block.timestamp, payable(msg.sender));
                                       
    emit ProductUploaded(productCounter, _productHash, _productName, _productDescription, _productPrice, block.timestamp, payable(msg.sender));
  }

}

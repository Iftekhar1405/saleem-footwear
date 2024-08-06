import React, { useState, useEffect } from 'react';
import './ProductGridAuth.css';
import './ProductCardAuth.css';
import axios from "axios";

const URL = "http://localhost:7000/api/v1";
// login request method
const login_body = {
  identifier: "9109390639",
  password: "secret",
}
const loginUser = async (body) => {
  try {
    const response = await axios.post(`${URL}/auth/login`, body);
    console.log("Login Successful:", response.data);
  } catch (error) {
    console.log(error);
  }
};

const register_body = {
  name:"dave",
  phone:"0449449494",
  email:"dave@gmail.com",
  password:"secret"
}
const registerUser = async (body) => {
  try {
    const response = await axios.post(`${URL}/auth/register`, body)
    console.log(response.data)
  } catch (error) {
    console.log(error.response.data)
  }
}

const logoutUser = async () =>{
  try {
    const response = await axios.get(`${URL}/auth/logout`)
    console.log(response.data);
    
  } catch (error) {
    console.log(error);
    
  }
}
// Envoking function
loginUser(login_body)

// const registerRes = registerUser(register_body)
// console.log(registerRes.response)

// logoutUser()


// to accress the product
const productBody = {
  name: "Water melon ",
  brand: "Paragon",
  article: "Thor01",
  set: [{
      size: "US-13",
      length:6
  }, {"size":"UK-15", "length": 7}],
  description: "Be Like Ironman. Fly in sky or space with these shoes.",
  color: ["red", "black", "pink"],
  price: 550,
  discount: 2,
  stock_quantity: 25,
  images: ["https://media.gettyimages.com/id/172417586/photo/elegant-black-leather-shoes.jpg?s=612x612&w=gi&k=20&c=_HiU2PSG-krAT5-QIlDskHEhmXOTYQzSushSW51F25c=", "imahe_2.jpeg"],
  material: "vibranium",
  gender:"unisex",
  season:"all-seasons",
  style:"chapri"

}
const CreateProduct = async (body) => {
  try {
    const productStat = await axios.post(`${URL}/products`, body)
    console.log(productStat);
    
  } catch (error) {
    console.error(error.response);
    
  }
}

// envoking produts routes
// CreateProduct(productBody)
const ProductGridAuth = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const editProduct = (productId) => {
    // Navigate to the product edit page or show a modal with edit form
    console.log(`Edit product with id: ${productId}`);
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <Link to={`/product/${product.id}`}>
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-brand">{product.brand}</p>
              <div className="product-info">
                <p className="product-mrp">MRP: ₹{product.price}</p>
                <p className="product-discount">Discount: {product.discountPercentage}%</p>
              </div>
              <p className="product-discounted-price">Discounted Price: ₹{product.price - (product.price * product.discountPercentage / 100)}</p>
              <p className="product-sizes">For: {product.gender}</p>
              <p className="product-sizes">Sizes: {product.sizes.map(size => `${size.size} (Length: ${size.length})`).join(', ')}</p>
            </div>
          </Link>
          <div className='buttons'>
            <button className="header-button edit-button" onClick={() => editProduct(product.id)}>Edit</button>
            <button className="header-button delete-button" onClick={() => deleteProduct(product.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGridAuth;

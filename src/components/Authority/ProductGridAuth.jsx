import React, { useState, useEffect } from 'react';
import './ProductGridAuth.css';
import './ProductCardAuth.css';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const URL = "http://localhost:7000/api/v1/products";

const ProductGridAuth = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null); // Track which product is being edited
  const [editedProduct, setEditedProduct] = useState({}); // Store edited product details

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const startEditing = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${URL}/${editedProduct._id}`, editedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(product => product._id === editedProduct._id ? response.data : product));
      setEditingProductId(null); // Exit edit mode
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${URL}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product._id} style={{ backgroundColor: '#000' }}>
          {editingProductId === product._id ? (
            <div className="edit-product-form">
              <input
                type="text"
                name="article"
                value={editedProduct.article || ''}
                onChange={handleEditChange}
                className="edit-input"
              />
              <input
                type="text"
                name="brand"
                value={editedProduct.brand || ''}
                onChange={handleEditChange}
                className="edit-input"
              />
              <input
                type="text"
                name="description"
                value={editedProduct.description || ''}
                onChange={handleEditChange}
                className="edit-input"
              />
              <input
                type="number"
                name="price"
                value={editedProduct.price || ''}
                onChange={handleEditChange}
                className="edit-input"
              />
              <input
                type="text"
                name="material"
                value={editedProduct.material || ''}
                onChange={handleEditChange}
                className="edit-input"
              />
              <input
                type="text"
                name="gender"
                value={editedProduct.gender || ''}
                onChange={handleEditChange}
                className="edit-input"
              />
              {/* Add other fields as needed */}
              <button className="header-button save-button" onClick={saveProduct}>Save</button>
              <button className="header-button cancel-button" onClick={() => setEditingProductId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <div className="product-image-gallery">
                {product.images.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`${product.brand} ${product.article}`} className="product-image" />
                ))}
              </div>
              <div className="product-details">
                <h2 className="product-name">{product.article}</h2>
                <p className="product-brand">{product.brand}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-info">
                  <p className="product-mrp">MRP: ₹{product.price}</p>
                  <p className="product-material">Material: {product.material}</p>
                  <p className="product-gender">Gender: {product.gender}</p>
                </div>
                <p className="product-sizes">
                  Available Sizes: {product.itemSet && product.itemSet.length > 0 
                    ? product.itemSet.map(item => `${item.size} (Length: ${item.lengths})`).join(', ') 
                    : "N/A"}
                </p>
                <p className="product-colors">
                  Colors: {product.colors && Object.keys(product.colors).length > 0 
                    ? Object.keys(product.colors).join(', ') 
                    : "N/A"}
                </p>
              </div>
              <div className='buttons'>
                {/* <button className="header-button edit-button" onClick={() => startEditing(product)}>Edit</button> */}
                <button onClick={() => deleteProduct(product._id)}>Delete</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGridAuth;

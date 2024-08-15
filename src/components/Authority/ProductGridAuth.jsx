import React, { useState, useEffect } from 'react';
import './ProductGridAuth.css';
import './ProductCardAuth.css';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1/products";

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

  const handleImageChange = (e, index) => {
    const updatedImages = [...(editedProduct.images || [])];
    updatedImages[index] = e.target.value;
    setEditedProduct(prevState => ({
      ...prevState,
      images: updatedImages
    }));
  };

  const handleColorImageChange = (e, color, index) => {
    const updatedColors = { ...editedProduct.colors };
    updatedColors[color][index] = e.target.value;
    setEditedProduct(prevState => ({
      ...prevState,
      colors: updatedColors
    }));
  };

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${URL}/${editedProduct._id}`, editedProduct, {
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

              {/* Image URLs */}
              <h4>Images</h4>
              {(editedProduct.images || []).map((imgUrl, index) => (
                <input
                  key={`${product._id}-image-${index}`}  // Add unique key
                  type="text"
                  value={imgUrl}
                  onChange={(e) => handleImageChange(e, index)}
                  className="edit-input"
                />
              ))}

              {/* Colors and their images */}
              <h4>Colors and Images</h4>
              {editedProduct.colors && Object.keys(editedProduct.colors).map((color, colorIndex) => (
                <div key={`${product._id}-color-${colorIndex}`}>
                  <h5>{color}</h5>
                  {editedProduct.colors[color].map((imgUrl, index) => (
                    <input
                      key={`${product._id}-${color}-${index}`}  // Add unique key
                      type="text"
                      value={imgUrl}
                      onChange={(e) => handleColorImageChange(e, color, index)}
                      className="edit-input"
                    />
                  ))}
                </div>
              ))}

              <button className="header-button save-button" onClick={saveProduct}>Save</button>
              <button className="header-button cancel-button" onClick={() => setEditingProductId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <div className="product-image-gallery">
                {(product.images || []).map((imgUrl, index) => (
                  <img key={`${product._id}-image-${index}`} src={imgUrl} alt={`${product.brand} ${product.article}`} className="product-image" />
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
                <button className="header-button edit-button" onClick={() => startEditing(product)}>Edit</button>
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

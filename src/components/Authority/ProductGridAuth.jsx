import React, { useState, useEffect } from 'react';
import './ProductGridAuth.css';
import './ProductCardAuth.css';
import axios from "axios";

const URL = "https://saleem-footwear-api.vercel.app/api/v1/products";

const ProductGridAuth = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(URL, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProducts(response.data.products);
      } catch (error) {
        alert("Error fetching products:", error);
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

  const handleImageChange = (e, index, type = 'default') => {
    if (type === 'default') {
      const updatedImages = [...(editedProduct.images || [])];
      updatedImages[index] = e.target.value;
      setEditedProduct(prevState => ({
        ...prevState,
        images: updatedImages
      }));
    } else {
      const updatedColorImages = [...(editedProduct.colors[type] || [])];
      updatedColorImages[index] = e.target.value;
      setEditedProduct(prevState => ({
        ...prevState,
        colors: {
          ...prevState.colors,
          [type]: updatedColorImages
        }
      }));
    }
  };

  const addImageField = (type = 'default') => {
    if (type === 'default') {
      setEditedProduct(prevState => ({
        ...prevState,
        images: [...(prevState.images || []), '']
      }));
    } else {
      setEditedProduct(prevState => ({
        ...prevState,
        colors: {
          ...prevState.colors,
          [type]: [...(prevState.colors[type] || []), '']
        }
      }));
    }
  };

  const handleImageRemove = (index, type = 'default') => {
    if (type === 'default') {
      const updatedImages = [...(editedProduct.images || [])];
      updatedImages.splice(index, 1);
      setEditedProduct(prevState => ({
        ...prevState,
        images: updatedImages
      }));
    } else {
      const updatedColorImages = [...(editedProduct.colors[type] || [])];
      updatedColorImages.splice(index, 1);
      setEditedProduct(prevState => ({
        ...prevState,
        colors: {
          ...prevState.colors,
          [type]: updatedColorImages
        }
      }));
    }
  };

  const addColorField = () => {
    setEditedProduct(prevState => ({
      ...prevState,
      colors: {
        ...prevState.colors,
        [`color${Object.keys(prevState.colors || {}).length + 1}`]: []
      }
    }));
  };

  const handleSizeRemove = (index) => {
    const updatedItemSet = [...(editedProduct.itemSet || [])];
    updatedItemSet.splice(index, 1);
    setEditedProduct(prevState => ({
      ...prevState,
      itemSet: updatedItemSet
    }));
  };

  const saveProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`${URL}/${editedProduct._id}`, editedProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(products.map(product => product._id === editedProduct._id ? response.data : product));
      setEditingProductId(null); 
    } catch (error) {
      alert("Error saving product:", error);
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
      alert("Error deleting product:", error);
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

              {/* Default Image URLs */}
              <h4>Default Images</h4>
              {(editedProduct.images || []).map((imgUrl, index) => (
                <div key={`${product._id}-image-${index}`}>
                  <input
                    type="text"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(e, index)}
                    className="edit-input"
                  />
                  <button onClick={() => handleImageRemove(index)}>Remove</button>
                </div>
              ))}
              <button onClick={() => addImageField()}>Add Image</button>

              {/* Colors and their images */}
              <h4>Colors and Images</h4>
              {editedProduct.colors && Object.keys(editedProduct.colors).map((color, colorIndex) => (
                <div key={`${product._id}-color-${colorIndex}`}>
                  <h5>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleColorNameChange(e, color)}
                      className="edit-input"
                    />
                    <button onClick={() => handleColorNameChange({ target: { value: '' } }, color)}>Remove Color</button>
                  </h5>
                  {editedProduct.colors[color].map((imgUrl, index) => (
                    <div key={`${product._id}-${color}-${index}`}>
                      <input
                        type="text"
                        value={imgUrl}
                        onChange={(e) => handleColorImageChange(e, color, index)}
                        className="edit-input"
                      />
                      <button onClick={() => handleColorImageRemove(color, index)}>Remove Image</button>
                    </div>
                  ))}
                  <button onClick={() => addImageField(color)}>Add Image for {color}</button>
                </div>
              ))}
              <button onClick={addColorField}>Add Color</button>

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
                <div className="product-buttons">
                  <button className="header-button edit-button" onClick={() => startEditing(product)}>Edit</button>
                  <button className="header-button delete-button" onClick={() => deleteProduct(product._id)}>Delete</button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProductGridAuth;

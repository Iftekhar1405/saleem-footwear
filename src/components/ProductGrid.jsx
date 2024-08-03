import React, { useState, useEffect } from 'react';
import './ProductGrid.css';
import './ProductCard.css';

const ProductGrid = () => {
  const [products, setProducts] = useState(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [];
  });

  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  useEffect(() => {
    const handleNewProduct = (event) => {
      const newProduct = event.detail;
      setProducts((prev) => {
        const updatedProducts = [...prev, newProduct];
        localStorage.setItem('products', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
    };

    window.addEventListener('new-product', handleNewProduct);
    return () => {
      window.removeEventListener('new-product', handleNewProduct);
    };
  }, []);

  useEffect(() => {
    if (editProductId !== null) {
      const product = products.find(p => p.id === editProductId);
      setEditedProduct(product);
    }
  }, [editProductId, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (index, key, value) => {
    const newSizes = [...editedProduct.sizes];
    newSizes[index][key] = value;
    setEditedProduct((prev) => ({ ...prev, sizes: newSizes }));
  };

  const saveChanges = () => {
    const updatedProducts = products.map((product) =>
      product.id === editProductId ? editedProduct : product
    );
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    setEditProductId(null);
  };

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const handleEditClick = (productId) => {
    if (editProductId === productId) {
      setEditProductId(null); // Exit edit mode
    } else {
      setEditProductId(productId); // Enter edit mode
    }
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div className="product-card" key={product.id}>
          <div className="product-image-container">
            {editProductId === product.id ? (
              <input
                type="text"
                name="imageUrl"
                value={editedProduct.imageUrl}
                onChange={handleChange}
                className="product-image-edit"
              />
            ) : (
              <img src={product.imageUrl} alt={product.name} className="product-image" />
            )}
          </div>
          <div className="product-details">
            {editProductId === product.id ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={editedProduct.name}
                  onChange={handleChange}
                  className="product-name-edit"
                />
                <input
                  type="text"
                  name="brand"
                  value={editedProduct.brand}
                  onChange={handleChange}
                  className="product-brand-edit"
                />
                <input
                  type="number"
                  name="price"
                  value={editedProduct.price}
                  onChange={handleChange}
                  className="product-price-edit"
                />
                <input
                  type="number"
                  name="discountPercentage"
                  value={editedProduct.discountPercentage}
                  onChange={handleChange}
                  className="product-discount-edit"
                />
                <textarea
                  name="description"
                  value={editedProduct.description}
                  onChange={handleChange}
                  className="product-description-edit"
                />
                <input
                  type="text"
                  name="gender"
                  value={editedProduct.gender}
                  onChange={handleChange}
                  className="product-gender-edit"
                />
                <div className="sizes-edit">
                  {editedProduct.sizes.map((size, index) => (
                    <div key={index} className="size-input">
                      <input
                        type="text"
                        name={`size-${index}`}
                        value={size.size}
                        onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
                        placeholder="Size"
                      />
                      <input
                        type="text"
                        name={`length-${index}`}
                        value={size.length}
                        onChange={(e) => handleSizeChange(index, 'length', e.target.value)}
                        placeholder="Length"
                      />
                    </div>
                  ))}
                </div>
                <button className="header-button save-button" onClick={saveChanges}>
                  Save
                </button>
              </>
            ) : (
              <>
                <h2 className="product-name">{product.name}</h2>
                <p className="product-brand">{product.brand}</p>
                <div className="product-info">
                  <p className="product-mrp">MRP: ₹{product.price}</p>
                  <p className="product-discount">Discount: {product.discountPercentage}%</p>
                </div>
                <p className="product-discounted-price">Discounted Price: ₹{product.price - (product.price * product.discountPercentage / 100)}</p>
                <p className="product-sizes">For: {product.gender}</p>
                <p className="product-sizes">Sizes: {product.sizes.map(size => `${size.size} (Length: ${size.length})`).join(', ')}</p>
                <p className="product-description">{product.description}</p>
                <div className='buttons'>
                  <button className="header-button edit-button" onClick={() => handleEditClick(product.id)}>
                    {editProductId === product.id ? 'Cancel' : 'Edit'}
                  </button>
                  <button className="header-button delete-button" onClick={() => deleteProduct(product.id)}>Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

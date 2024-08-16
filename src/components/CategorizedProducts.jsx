import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductCard.css';

const CategorizedProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://saleem-footwear-api.vercel.app/v1/search', {
          params: {
            category,
            // Add any other parameters if needed
          },
          maxBodyLength: Infinity
        });

        setProducts(response.data.products); // Assuming response.data.products contains the products
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-grid">
      {products.length > 0 ? (
        products.map((product) => (
          <div className="product-card" key={product.id} style={{ backgroundColor: '#000' }}>
            <Link to={`/product/${product.id}`}>
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
            </Link>
          </div>
        ))
      ) : (
        <p>No products found for this category.</p>
      )}
    </div>
  );
};

export default CategorizedProducts;

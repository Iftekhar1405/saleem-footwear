import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductCard = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:7000/api/v1/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <div>Loading...</div>;

  const deleteProduct = (productId) => {
    const updatedProducts = products.filter((product) => product.id !== productId);
    setProduct(updatedProducts);
    localStorage.setItem('products', JSON.stringify(updatedProducts));
  };

  const editProduct = (productId) => {
    // Navigate to the product edit page or show a modal with edit form
    console.log(`Edit product with id: ${productId}`);
  };
  const [cart, setCart] = useLocalStorage('cart', []);
  const [liked, setLiked] = useLocalStorage('liked', []);

  const addToCart = (product) => setCart([...cart, product]);
  const addToLiked = (product) => setLiked([...liked, product]);

  return (
    <div className="product-grid">
      {product.map((product) => (
        <div className="product-card" key={product.id}>
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
            <p className="product-description">{product.description}</p>

            <select className='product-size'>
              <option value="">Choose size</option>
              {product.sizes.map((size, index) => (
                <option key={index} value={size.size}>{size.size} (Length: {size.length})</option>
              ))}
            </select>

            <select name="set" className='product-set-len'>
              <option value="">Choose set</option>
              {['set1', 'Set 2', 'Set 3'].map((set, index) => (
                <option key={index} value={set}>{set}</option>
              ))}
            </select>

            <div className='buttons'>
            <button className="header-button" onClick={() => addToLiked(product)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                  <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
              </button>
              <span className="v-bar"> &#124;</span>
              <button className="header-button" onClick={() => addToCart(product)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                  <path fill="#ffffff" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './ProductGrid.css';
// import './ProductCard.css'
import { Link } from 'react-router-dom';

const URL = "https://saleem-footwear-api.vercel.app/api/v1"
const token = localStorage.getItem('token')
// export const addToCart = async (product) => {
//   try {
//     const headers = {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     };

//     // Fetch existing cart items
//     const cartResponse = await axios.get(`${URL}/cart`, { headers });
//     const cartItems = cartResponse.data.data.items;

//     console.log("Cart Items:", cartItems); // Debugging
//     console.log("Product ID:", product._id); // Debugging

//     const existingCartItem = cartItems.find(item => item.productId?item.productId._id === product._id:false);

//     if (existingCartItem) {
//       // Product already in cart, update quantity
//       const updatedBody = {
//         productId: product._id,
//         quantity: existingCartItem.quantity + 1,
//       };
//       const response = await axios.post(`${URL}/cart/add-to-cart`, updatedBody, { headers });
//       console.log('Cart updated:', response.data);
//     } else {
//       // Product not in cart, add new product
//       const newBody = {
//         productId: product._id,
//         quantity: 1, // Default quantity
//         itemSet: product.itemSet[0]|| [], // Default to an empty array if itemSet is not available
//         color: product.colors ? Object.keys(product.colors)[0] : "N/A" // Default to the first color or "N/A" if not available
//       };
//       const response = await axios.post(`${URL}/cart/add-to-cart`, newBody, { headers });
//       console.log('Product added to cart:', response.data);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };



const useFetchData = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(url);
        setData(response.data.products);
        console.log(response.data.products)
      } catch (error) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [url]);

  return { data, loading, error };
};

const ProductGrid = () => {
  const { data: products, loading, error } = useFetchData(`${URL}/products`);
 
  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>Something went wrong</h2>;
  }

  return (
    <div className="product-grid" style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0',margin:'0'
      
    }}>
      {products.map((product) => (
        <div className="product-card" key={product._id} style={{margin:'0',borderRadius:'0',width:'50vw',backgroundColor:'#EDEADE'}} >
          <Link to={`/product/${product._id}`}>
            <div className="product-image-gallery">
              {product.images.map((imgUrl, index) => (
                <img key={index} src={imgUrl} alt={`${product.brand} ${product.article}`} className="product-image" style={{height:'180px',
                  width:'200px',objectFit:'cover',objectPosition:'center'
                }} />
              ))}
            </div>
            <div className="product-details"  style={{backgroundColor:'#EDEADE',paddingBottom:'0px',paddingRight:'10px'
              ,marginBottom:'0'
            }}>
            
              <h2 className="product-name">{product.article}</h2>
              <p className="product-brand">{product.brand}</p>
              <div className="product-info" style={{display:'flex',flexDirection:'column',alignItems:'flex-start',color:'#36454f',fontWeight:'bold'
                ,
              }}>
                <span className="product-mrp" style={{textDecoration:'none',marginBottom:'5px'}}>MRP: ₹{product.price}</span>
                <br />
                <span className="product-colors" style={{color:'#36454f',fontWeight:'bold',fontSize:'small', opacity:'0.75'
                }}>
                Colors: {product.colors && Object.keys(product.colors).length > 0 
                  ? Object.keys(product.colors).join(', ') 
                  : "N/A"}
              </span>
                
                {/* <div style={{display:'flex',justifyContent:'space-between', width:'100%', margin:'0px'}}>
                <p className="product-material">Material: {product.material}</p>
                <p className="product-gender">Gender: {product.gender}</p>
                </div> */}
              </div>
              {/* <p className="product-sizes">
                Available Sizes: {product.itemSet && product.itemSet.length > 0 
                  ? product.itemSet.map(item => `${item.size} (PCs: ${item.lengths})`).join(', ') 
                  : "N/A"}
              </p> */}
              
            </div>
          </Link>
          {/* <div className="buttons">
            <button onClick={() => addToLiked(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF">
                <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
              </svg>
            </button>
            <span className="v-bar"> &#124;</span>
            <button onClick={() => addToCart(product)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
              </svg>
            </button>
          </div> */}
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;

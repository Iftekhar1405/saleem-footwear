import React from 'react';
import ProductCard from './ProductsCards';
import './ProductGrid.css';

const ProductGrid = ({ products,addToCart }) => {
    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
        </div>
    );
};

export default ProductGrid;

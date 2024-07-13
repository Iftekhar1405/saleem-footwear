import React from 'react';
import ProductCard from './ProductsCards';
import './ProductGrid.css';

const ProductGrid = ({ products }) => {
    return (
        <div className="product-grid">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
};

export default ProductGrid;

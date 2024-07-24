import React from 'react';
import ProductCard from './ProductsCards';
import './ProductGrid.css';
import productsData from './db/products.json';

const ProductGrid = () => {
    return (
        <div className="product-grid">
            {productsData.products.map((product) => (
                <ProductCard key={product.id} product={product}  />
            ))}
        </div>
    );
};

export default ProductGrid;

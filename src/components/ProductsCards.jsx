import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    const {
        image,
        name,
        brand,
        gender,
        mrp,
        discountPercentage,
        discountedPrice,
        sizes,
    } = product;

    return (
        <div className="product-card">
            <img src={image} alt={name} className="product-image" />
            <div className="product-details">
                <h2 className="product-name">{name}</h2>
                <p className="product-brand">{brand}</p>
                <div className="product-info">
                    <p className="product-mrp">MRP: ₹{mrp}</p>
                    <p className="product-discount">Discount: {discountPercentage}%</p>
                </div>
                <p className="product-discounted-price">Discounted Price: ₹{discountedPrice}</p>
                <p className="product-sizes">Sizes: {sizes.join(', ')}</p>
            </div>
        </div>
    );
};

export default ProductCard;

import React, { useState } from 'react';
import './AddProduct.css';
import ProductGridAuth from './ProductGridAuth';

function AddProduct() {
    const [product, setProduct] = useState({
        imageUrl: '',
        brand: '',
        article: '',
        colors: [''],
        sizes: [{ size: '', length: '' }],
        description: '',
        gender: '',
        price: '',
        discountPercentage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const handleColorChange = (index, e) => {
        const newColors = [...product.colors];
        newColors[index] = e.target.value;
        setProduct({ ...product, colors: newColors });
    };

    const handleAddColor = () => {
        setProduct({ ...product, colors: [...product.colors, ''] });
    };

    const handleSizeChange = (index, field, e) => {
        const newSizes = [...product.sizes];
        newSizes[index][field] = e.target.value;
        setProduct({ ...product, sizes: newSizes });
    };

    const handleAddSize = () => {
        setProduct({ ...product, sizes: [...product.sizes, { size: '', length: '' }] });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Get existing products from local storage
        const existingProducts = JSON.parse(localStorage.getItem('products')) || [];
        // Add the new product
        existingProducts.push(product);
        // Save back to local storage
        localStorage.setItem('products', JSON.stringify(existingProducts));
        // Clear the form (optional)
        setProduct({
            brand: '',
            article: '',
            imageUrl: '',
            sizes: [{ size: '', length: '' }],
            
            colors: [''],
            
            description: '',
            gender: '',
            price: '',
            discountPercentage: ''
        });
        alert('Product added successfully!');
    };
    const URL = "http://localhost:7000/api/v1";
    const CreateProduct = async (body) => {
        try {
          const productStat = await axios.post(`${URL}/products`, body)
          console.log(productStat);
          
        } catch (error) {
          console.error(error.response);
          
        }
      }

    return (
        <>
        <div className='add-product'>
            <h2>Add Product</h2>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <label>Image URL:</label>
                    <input type='text' name='imageUrl' value={product.imageUrl} onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label>Brand:</label>
                    <input type='text' name='brand' value={product.brand} onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label>Article:</label>
                    <input type='text' name='article' value={product.article} onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label>Colors:</label>
                    {product.colors.map((color, index) => (
                        <div key={index}>
                            <input
                                type='text'
                                value={color}
                                onChange={(e) => handleColorChange(index, e)}
                            />
                        </div>
                    ))}
                    <button type='button' onClick={handleAddColor}>Add More</button>
                </div>
                <div className='form-group'>
                    <label>Sizes and Lengths:</label>
                    {product.sizes.map((size, index) => (
                        <div key={index} className='size-length'>
                            <input
                                type='text'
                                placeholder='Size'
                                value={size.size}
                                onChange={(e) => handleSizeChange(index, 'size', e)}
                            />
                            <input
                                type='text'
                                placeholder='Length'
                                value={size.length}
                                onChange={(e) => handleSizeChange(index, 'length', e)}
                            />
                        </div>
                    ))}
                    <button type='button' onClick={handleAddSize}>Add More</button>
                </div>
                <div className='form-group'>
                    <label>Description:</label>
                    <textarea name='description' value={product.description} onChange={handleChange}></textarea>
                </div>
                <div className='form-group'>
                    <label>Gender:</label>
                    <select name='gender' value={product.gender} onChange={handleChange}>
                        <option value=''>Select Gender</option>
                        <option value='male'>Male</option>
                        <option value='female'>Female</option>
                        <option value='unisex'>Unisex</option>
                        <option value='kids'>Kids</option>
                    </select>
                </div>
                <div className='form-group'>
                    <label>Price:</label>
                    <input type='number' name='price' value={product.price} onChange={handleChange} />
                </div>
                <div className='form-group'>
                    <label>Discount Percentage:</label>
                    <input type='number' name='discountPercentage' value={product.discountPercentage} onChange={handleChange} />
                </div>
                <button type='submit'>Add Product</button>
            </form>
        </div>
        <ProductGridAuth/>
        </>
    );
}

export default AddProduct;

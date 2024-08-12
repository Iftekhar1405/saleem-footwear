import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';
import ProductGridAuth from './ProductGridAuth';

function AddProduct() {
    const [product, setProduct] = useState({
        images: ['', ''], // Default images
        brand: '',
        article: '',
        colors: {}, // Colors object with color name as key and array of images as value
        sizes: [{ size: '', length: '' }],
        description: '',
        gender: '',
        price: '',
        category: ''
    });

    // Handle change for simple text inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct({ ...product, [name]: value });
    };

    // Handle change for default images
    const handleimageChange = (index, e) => {
        const newimages = [...product.images];
        newimages[index] = e.target.value;
        setProduct({ ...product, images: newimages });
    };

    // Handle adding more default images (limit to 2)
    const handleAddimage = () => {
        if (product.images.length < 2) {
            setProduct({ ...product, images: [...product.images, ''] });
        }
    };

    // Handle color name change
    const handleColorNameChange = (colorName, newColorName) => {
        const updatedColors = { ...product.colors };
        if (newColorName && newColorName !== colorName) {
            updatedColors[newColorName] = updatedColors[colorName] || [];
            delete updatedColors[colorName];
        }
        setProduct({ ...product, colors: updatedColors });
    };

    // Handle image URL change for a specific color
    const handleColorImageChange = (colorName, imageIndex, imageUrl) => {
        const updatedColors = { ...product.colors };
        updatedColors[colorName][imageIndex] = imageUrl;
        setProduct({ ...product, colors: updatedColors });
    };

    // Handle adding a new image URL input for a specific color
    const handleAddColorImage = (colorName) => {
        const updatedColors = { ...product.colors };
        updatedColors[colorName] = [...(updatedColors[colorName] || []), ''];
        setProduct({ ...product, colors: updatedColors });
    };

    // Handle adding a new color with its images
    const handleAddColor = () => {
        setProduct({ ...product, colors: { ...product.colors, '': [''] } });
    };

    // Handle size and length changes
    const handleSizeChange = (index, field, e) => {
        const newSizes = [...product.sizes];
        newSizes[index][field] = e.target.value;
        setProduct({ ...product, sizes: newSizes });
    };

    const handleAddSize = () => {
        setProduct({ ...product, sizes: [...product.sizes, { size: '', length: '' }] });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:7000/api/v1/products', product);
            console.log('Product added:', response.data);
            setProduct({
                images: ['', ''],
                brand: '',
                article: '',
                colors: {},
                sizes: [{ size: '', length: '' }],
                description: '',
                gender: '',
                price: '',
                category: ''
            });
            alert('Product added successfully!');
            console.log(response)
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <>
            <div className='add-product'>
                <h2>Add Product</h2>
                <form onSubmit={handleSubmit}>
                    <div className='form-group'>
                        <label>Default Images:</label>
                        {product.images.map((imageUrl, index) => (
                            <div key={index}>
                                <input
                                    type='text'
                                    value={imageUrl}
                                    onChange={(e) => handleimageChange(index, e)}
                                />
                            </div>
                        ))}
                        <button type='button' onClick={handleAddimage}>Add More Default Images</button>
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
                        <label>Colors and Images:</label>
                        {Object.entries(product.colors).map(([colorName, images], colorIndex) => (
                            <div key={colorIndex}>
                                <input
                                    type='text'
                                    placeholder='Color Name'
                                    value={colorName}
                                    onChange={(e) => handleColorNameChange(colorName, e.target.value)}
                                />
                                {images.map((imageUrl, imageIndex) => (
                                    <div key={imageIndex}>
                                        <input
                                            type='text'
                                            placeholder='Image URL'
                                            value={imageUrl}
                                            onChange={(e) => handleColorImageChange(colorName, imageIndex, e.target.value)}
                                        />
                                    </div>
                                ))}
                                <button type='button' onClick={() => handleAddColorImage(colorName)}>Add More Images</button>
                            </div>
                        ))}
                        <button type='button' onClick={handleAddColor}>Add More Colors</button>
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
                        <button type='button' onClick={handleAddSize}>Add More Sizes</button>
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
                        <label>Category:</label>
                        <input type='text' name='category' value={product.category} onChange={handleChange} />
                    </div>
                    <button type='submit'>Add Product</button>
                </form>
            </div>
            <ProductGridAuth />
        </>
    );
}

export default AddProduct;

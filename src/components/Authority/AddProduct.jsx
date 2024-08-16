import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css';
import ProductGridAuth from './ProductGridAuth';

function AddProduct() {
    const [product, setProduct] = useState({
        images: ['', ''],
        brand: '',
        article: '',
        material: '', // Added material field
        colors: {},
        itemSet: [{ size: '', lengths: '' }],
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
    const handleImageChange = (index, e) => {
        const newImages = [...product.images];
        newImages[index] = e.target.value;
        setProduct({ ...product, images: newImages });
    };

    // Handle adding more default images (limit to 2)
    const handleAddImage = () => {
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

    // Handle size and length changes (aligned with schema)
    const handleSetChange = (index, field, e) => {
        const newSet = [...product.itemSet];
        newSet[index][field] = e.target.value;
        setProduct({ ...product, itemSet: newSet });
    };

    const handleAddSet = () => {
        setProduct({ ...product, itemSet: [...product.itemSet, { size: '', lengths: '' }] });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Ensure colors object has no empty keys
        const colors = Object.fromEntries(
            Object.entries(product.colors).filter(([key, value]) => key && value.length > 0)
        );
    
        const productData = {
            ...product,
            colors,
        };

        try {

            const token = (localStorage.getItem('token')); // Retrieve the token from local storage
    
            const response = await axios.post('https://saleem-footwear-api.vercel.app/api/v1/products', productData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the request headers
                },
            });
    

            console.log('Product added:', response.data);
            setProduct({
                images: ['', ''],
                brand: '',
                article: '',
                material: '', // Reset material field
                colors: {},
                itemSet: [{ size: '', lengths: '' }],
                description: '',
                gender: '',
                price: '',
                category: ''
            });
            alert('Product added successfully!');
        } catch (error) {
            alert('Error adding product:', error);
            console.log(product);
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
                                    onChange={(e) => handleImageChange(index, e)}
                                />
                            </div>
                        ))}
                        <button type='button' onClick={handleAddImage}>Add More Default Images</button>
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
                        <label>Material:</label> {/* Added input field for material */}
                        <input type='text' name='material' value={product.material} onChange={handleChange} />
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
                        <label>Item Sets:</label>
                        {product.itemSet.map((set, index) => (
                            <div key={index} className='size-length'>
                                <input
                                    type='text'
                                    placeholder='Size'
                                    value={set.size}
                                    onChange={(e) => handleSetChange(index, 'size', e)}
                                />
                                <input
                                    type='text'
                                    placeholder='Pcs'
                                    value={set.lengths}
                                    onChange={(e) => handleSetChange(index, 'lengths', e)}
                                />
                            </div>
                        ))}
                        <button type='button' onClick={handleAddSet}>Add More Item Sets</button>
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
            
        </>
    );
}

export default AddProduct;

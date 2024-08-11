import React, { useState, useEffect } from 'react';
import './Cart.css';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const Liked = () => {
  const [Liked, setLiked] = useState(() => {
    const savedLiked = localStorage.getItem('Liked');
    return savedLiked ? JSON.parse(savedLiked) : [];
  });

  useEffect(() => {
    localStorage.setItem('Liked', JSON.stringify(Liked));
    window.dispatchEvent(new Event('Liked-updated'));
  }, [Liked]);

  const removeFromLiked = (index) => {
    const updatedLiked = Liked.filter((_, i) => i !== index);
    setLiked(updatedLiked);
  };

  const handlePdfDownload = () => {
    const input = document.querySelector('.cart');

    // Change text color to black
    const originalColor = input.style.color;
    input.style.color = 'black';

    html2canvas(input, { scale: 2, useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [canvas.width, canvas.height],
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('liked.pdf');

      // Revert text color back to original
      input.style.color = originalColor;
    });
  };

  return (
    <div className="cart">
      <h2>Liked</h2>
      <button onClick={handlePdfDownload}>Download your Likes</button>
      {Liked.length === 0 ? (
        <p>No liked product</p>
      ) : (
        <ul>
          {Liked.map((item, index) => (
            <li key={index} className="cart-item">
              <img src={item.image} alt={item.name} />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>Brand: {item.brand}</p>
                <p>Price: ₹{item.discountedPrice}</p>
                <p>Sizes: {item.sizes.join(', ')}</p>
                <button className="remove-button" onClick={() => removeFromLiked(index)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Liked;

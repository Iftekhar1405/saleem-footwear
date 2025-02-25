import React, { useEffect, useRef } from "react";
import mens from "./images/Men.webp";
import womens from "./images/women.webp";
import kids from "./images/Kids.webp";
import "./Style.css";

function Scroll() {
  const carouselRef = useRef(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    let scrollAmount = 0;

    const scrollImages = () => {
      if (carousel) {
        scrollAmount += 0.3; // Adjust scroll speed here
        if (scrollAmount >= carousel.scrollWidth / 2) {
          scrollAmount = 0; // Reset when reaching the duplicate images
        }
        carousel.style.transform = `translateX(-${scrollAmount}px)`;
        requestAnimationFrame(scrollImages);
      }
    };

    const animationId = requestAnimationFrame(scrollImages);
    return () => cancelAnimationFrame(animationId); // Cleanup on component unmount
  }, []);

  return (
    <div className="carousel-container">
      <div className="carousel-track" ref={carouselRef}>
        {/* Original images */}
        <img src={mens} alt="Men" className="carousel-image" />
        <img src={womens} alt="Women" className="carousel-image" />
        <img src={kids} alt="Kids" className="carousel-image" />
        {/* Duplicate images for seamless looping */}
        <img src={mens} alt="Men Duplicate" className="carousel-image" />
        <img src={womens} alt="Women Duplicate" className="carousel-image" />
        <img src={kids} alt="Kids Duplicate" className="carousel-image" />
      </div>
    </div>
  );
}

export default Scroll;








// import mens from './images/Men.webp'
// import womens from './images/women.webp'
// import kids from './images/Kids.webp'
// import './Style.css'
// import React from 'react'
// function Scroll(){
//     return(
//             <div className="scroll-container">
//                 <img src= {mens} alt="Image 1" />
//                 <img src={womens} alt="Image 2" />
//                 <img src= {kids} alt="Image 3" />
//             </div>

//     )
// }
// export default Scroll
import mens from './images/Men.webp'
import womens from './images/women.webp'
import kids from './images/Kids.webp'
import './Style.css'
import React from 'react'
function Scroll(){
    return(
            <div className="scroll-container">
                <img src= {mens} alt="Image 1" />
                <img src={womens} alt="Image 2" />
                <img src= {kids} alt="Image 3" />
            </div>

    )
}
export default Scroll
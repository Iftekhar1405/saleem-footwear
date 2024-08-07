import axios from 'axios';
import React from 'react';
import './Style.css';


const CreateOrder = async (body) => {
    const URL = "http://localhost:7000/api/v1";
    try {
      const token = localStorage.getItem('jwtoken');
      
      const response = await axios.post(`${URL}/order`, body, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
  
      console.log("Order created successfully:", response.data);
    } catch (error) {
        console.error(error)
    //   if (error.response) {
    //     // The request was made and the server responded with a status code
    //     // that falls out of the range of 2xx
    //     console.error("Error response:", error.response.data);
    //     console.error("Error status:", error.response.status);
    //     console.error("Error headers:", error.response.headers);
    //   } else if (error.request) {
    //     // The request was made but no response was received
    //     console.error("Error request:", error.request);
    //   } else {
    //     // Something happened in setting up the request that triggered an Error
    //     console.error("Error message:", error.message);
    //   }
    //   console.error("Error config:", error.config);
    }
};
const OrderBody = {
    
    "orderId": "12345",
    "orderDetail": [
      {
        "productId": "604b2f4e3c13e72b2c062b6b",
        "quantity": 2,
        "set": "M",
        "amount": 50,
        "totalPrice": 100
      }
    ],
    "status": "Pending"
  
  
}
CreateOrder(OrderBody)


// logOut function
const logoutUser = async () =>{
    try {
      const response = await axios.get(`${URL}/auth/logout`)
      localStorage.removeItem('jwtoken', 'role');
      console.log(response.data);
      
    } catch (error) {
      console.log(error);
      
    }
  }
// logoutUser()
function Test() {
    return (
        <div className='search-container'>
        </div>
    );
}

export default Test;

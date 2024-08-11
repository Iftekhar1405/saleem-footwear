import React, { useEffect, useState } from 'react';
import './Profile.css'; // Optional: Create a CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfileFromLocalStorage = () => {
      try {
        const token = localStorage.getItem('token'); // Adjust key if necessary
        if (token) {
          // Parse the token if needed (assuming it's a JSON string or JWT)
          const userInfo = JSON.parse(atob(token.split('.')[1])); // For JWT, parsing payload
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Error fetching profile from local storage:', error);
      }
    };

    fetchProfileFromLocalStorage();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <div className="profile-details">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Address:</strong> {user.address}</p>
        <p><strong>Role:</strong> {user.role}</p>
        {/* Add more details as needed */}
      </div>
    </div>
  );
};

export default Profile;

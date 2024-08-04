import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css'; // Optional: Create a CSS file for styling

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:7000/api/v1/profile'); // Adjust this URL to match your backend endpoint
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
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

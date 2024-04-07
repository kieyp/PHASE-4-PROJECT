import React from 'react';

function Profile() {
  // Dummy data for demonstration
  const blogsWritten = 10; 
  const blogsRead = 20; 

  return (
    <div>
      <h2>My Profile</h2>
      <div>
        <img
          src="https://via.placeholder.com/150"
          alt="Profile Picture"
          style={{ borderRadius: '50%', width: '150px', height: '150px' }}
        />
      </div>
      <div>
        <h3>Personal Information</h3>
        <p>Name: Abid Mohamed</p>
        <p>Email: abi.moha@gmail.com</p>
      </div>
      <div>
        <h3>Blog Statistics</h3>
        <p>Blogs Written: {blogsWritten}</p>
        <p>Blogs Read: {blogsRead}</p>
      </div>
    </div>
  );
}

export default Profile;

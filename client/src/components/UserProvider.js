import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for user data
const UserContext = createContext();

// Create a provider component to provide user data to the components
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No auth token found');
        }

        const response = await fetch('/api/user', {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to consume the user data from the context
export const useUser = () => useContext(UserContext);

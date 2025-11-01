import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserProfile, logoutUser } from '../services/authService';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
        const storedData = localStorage.getItem('adminUser');
        if (storedData) {
            const { token: storedToken, user: storedUser } = JSON.parse(storedData);
            if (storedToken && storedUser) {
                // Optionally: Validate token by fetching user profile
                // You could skip this for faster initial load if token expiry is handled elsewhere
                try {
                   // Make sure api interceptor will pick up the token from storedData
                   setToken(storedToken); // Temporarily set token for the API call
                   const profile = await getCurrentUserProfile();
                   setUser(profile);
                   // Token is valid
                   console.log("Auth Status: Token valid, user loaded.");
                } catch (profileError) {
                   console.error("Token validation failed:", profileError);
                   // Token likely expired or invalid
                   handleLogout(); // Clear invalid state
                }

            } else {
                 handleLogout(); // Clear incomplete stored data
            }
        } else {
            // No stored data, user is not logged in
            setUser(null);
            setToken(null);
            console.log("Auth Status: No user data found.");
        }
    } catch (error) {
        console.error("Error checking auth status:", error);
        handleLogout(); // Clear state on error
    } finally {
        setIsLoading(false);
    }
  };


  const handleLogin = (newToken, userData) => {
    const dataToStore = JSON.stringify({ token: newToken, user: userData });
    localStorage.setItem('adminUser', dataToStore);
    setToken(newToken);
    setUser(userData);
    setIsLoading(false); // Ensure loading is false after login
    console.log("User logged in:", userData.email);
  };

  const handleLogout = () => {
    logoutUser(); // Clears localStorage via the service function
    setUser(null);
    setToken(null);
    setIsLoading(false); // Ensure loading is false after logout
    console.log("User logged out.");
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isLoading,
        login: handleLogin,
        logout: handleLogout,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

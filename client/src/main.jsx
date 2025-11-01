import React from 'react';
import ReactDOM from 'react-dom/client'; // Use createRoot from react-dom/client
import App from './App'; // Your main application component
import './index.css'; // Global styles
import { AuthProvider } from './contexts/AuthContext'; // Import your AuthProvider

// Find the root element in your index.html
const rootElement = document.getElementById('root');

// Ensure the root element exists before creating the root
if (rootElement) {
  // Create a root instance
  const root = ReactDOM.createRoot(rootElement);

  // Render the application
  root.render(
    <React.StrictMode>
      {/* Wrap the entire App component with AuthProvider */}
      {/* This makes authentication state available globally */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element. Make sure your index.html has an element with id="root".');
}
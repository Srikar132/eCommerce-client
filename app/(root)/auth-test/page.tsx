// Test page to demonstrate auth functionality
'use client';

import { useEffect, useState } from 'react';

export default function AuthTestPage() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    // Check if we can access this protected route
    setStatus('Successfully accessed protected route!');
  }, []);

  const handleLogout = async () => {
    // Clear cookies and redirect to login
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    window.location.href = '/login';
  };

  const setTestTokens = () => {
    // Set expired access token and valid refresh token for testing
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImV4cCI6MTY3MDAwMDAwMH0.expired';
    const validRefreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXIiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImV4cCI6OTk5OTk5OTk5OX0.valid';
    
    document.cookie = `accessToken=${expiredToken}; path=/;`;
    document.cookie = `refreshToken=${validRefreshToken}; path=/;`;
    
    alert('Test tokens set! Refresh the page to test token refresh flow.');
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      <p className="mb-4">Status: {status}</p>
      
      <div className="space-x-4">
        <button 
          onClick={setTestTokens}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Set Test Tokens (Expired Access + Valid Refresh)
        </button>
        
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold mb-2">Test Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Set Test Tokens" to simulate expired access token scenario</li>
          <li>Refresh this page - you should be redirected through the refresh flow</li>
          <li>If refresh succeeds, you'll be back on this page</li>
          <li>If refresh fails, you'll be redirected to login</li>
        </ol>
      </div>
    </div>
  );
}

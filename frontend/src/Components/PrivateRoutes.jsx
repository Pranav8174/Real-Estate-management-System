import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import React from 'react';

const PrivateRoutes = ({ children }) => {
  const JWT_SECRET='a3v5$7Y!z*2Dh@1jL%4O*8t@dU8PqL0oM9W9kZgR*3JvX!2KpCq5H3';
  const authToken = Cookies.get('auth_token');

  if(!authToken) return <Navigate to='/signup'/>

  try {
    const decodedToken = jwt.verify(authToken, JWT_SECRET);
    
    if (decodedToken.exp < Date.now() / 1000) {
      return <Navigate to="/signup" />;
    }
  } catch (error) {
    return <Navigate to="/signup" />;
  }

  return children;
};

export default PrivateRoutes;

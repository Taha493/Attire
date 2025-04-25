// // src/components/auth/PrivateRoute.js
// import React from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { authService } from "../../services/api";

// const PrivateRoute = ({ children }) => {
//   const location = useLocation();
//   const isAuthenticated = authService.isAuthenticated();

//   if (!isAuthenticated) {
//     // Redirect to login page and save the attempted URL for redirection after login
//     return <Navigate to="/login" state={{ from: location.pathname }} />;
//   }

//   return children;
// };

// export default PrivateRoute;

import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  // Simulate authentication state (replace with actual logic if needed)
  const isAuthenticated = false; // Set to true/false for testing purposes

  if (!isAuthenticated) {
    // Redirect to login page and save the attempted URL for redirection after login
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  return children;
};

export default PrivateRoute;

import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth';

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getCurrentUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.user_type)) {
    if (user?.user_type === 'landlord') return <Navigate to="/landlord-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

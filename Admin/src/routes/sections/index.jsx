import { Navigate, useRoutes } from 'react-router-dom';
import { authRoutes } from './auth';
import { adminRoute } from './adminRoutes';
import { vendorRoutes } from './vendorRoute';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MotionLazy } from 'src/components/animate/motion-lazy';

export function Router() {
  const { authUser } = useSelector((state) => state.auth);
  const [userRole, setUserRole] = useState(null);
  const [isRoleFetched, setIsRoleFetched] = useState(false);

  // Fetch role from Redux or localStorage
  useEffect(() => {
    const fetchUserRole = () => {
      if (authUser?.role) {
        setUserRole(authUser.role);
      } else {
        const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
        setUserRole(storedUserData?.user?.role || null);
      }
      setIsRoleFetched(true); // Set role as fetched
    };

    fetchUserRole(); // Run on mount and whenever authUser changes
  }, [authUser]);

  // Define base routes for everyone
  const baseRoutes = [
    {
      path: '/',
      element: <Navigate to="/dashboard" replace />, // Redirect root to dashboard
    },
    ...authRoutes, // Auth routes (e.g., login)
  ];

  // Define role-specific routes based on user role
  const roleSpecificRoutes = userRole
    ? userRole === 'Admin'
      ? adminRoute // Admin specific routes
      : userRole === 'Vendor'
        ? vendorRoutes // Vendor specific routes
        : [] // Add more roles as needed
    : []; // If no role is fetched, return empty array

  // Combine general routes with role-specific ones and a fallback for unmatched paths
  const routes = [
    ...baseRoutes,
    ...roleSpecificRoutes,
    { path: '*', element: <Navigate to="/auth/sign-in" replace /> }, // Redirect to sign-in for unmatched routes
  ];

  const element = useRoutes(routes);
  // Show a loading indicator until the role is fetched
  if (!isRoleFetched) {
    return <MotionLazy />
  }

  return element; // Render the matched routes based on current state
}
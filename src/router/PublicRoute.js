import { Navigate, useLocation } from 'react-router-dom';

const PublicRoute = () => {
  const location = useLocation();
  return (
    <Navigate
      to="/dashboard"
      state={{ from: location }}
      replace
    />
  ) 
};

export default PublicRoute;

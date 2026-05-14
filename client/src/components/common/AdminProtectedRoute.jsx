// Guards admin-only routes — redirects non-admins to /admin/login
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "./Loader.jsx";

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useSelector(
    (state) => state.auth,
  );

  if (loading) return <Loader />;

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;

import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  const { role } = jwtDecode(token);

  return allowedRoles.includes(role) ? children : <Navigate to="/login" />;
};

export default PrivateRoute;

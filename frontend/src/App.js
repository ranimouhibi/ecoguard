import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboardPage from "./pages/EmployeeDashboardPage";
import EmployeeManagementPage from "./pages/EmployeeManagementPage";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import ProfilePage from "./pages/ProfilePage";
import EmployersList from "./pages/EmployersList";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import { AuthContext } from "./context/AuthContext";
import NotificationsPage from "./pages/NotificationsPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
function AppRoutes() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) return <div>Chargement...</div>;

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {isAuthenticated && !isLoginPage && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
         
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin", "manager"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
         <Route path="/notifications" element={<NotificationsPage />} />
        
        <Route path="/employee" element={<EmployeeDashboardPage />} />
        <Route
          path="/admin/gestion-employes"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <EmployeeManagementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/employers"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <EmployersList />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <PrivateRoute allowedRoles={["admin", "employee", "manager"]}>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute allowedRoles={["admin", "employee", "manager"]}>
              <EditProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile/change-password"
          element={
            <PrivateRoute allowedRoles={["admin", "employee", "manager"]}>
              <ChangePasswordPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

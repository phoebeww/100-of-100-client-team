import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import OrganizationPage from './pages/dashboard/OrganizationPage';
import DepartmentPage from './pages/departments/DepartmentPage';
import DepartmentDetailPage from './pages/departments/DepartmentsDetailPage';
import EmployeesPage from './pages/employees/EmployeesPage';
import EditEmployeePage from "./pages/employees/EditEmployeePage.tsx";
import AddEmployeePage from "./pages/employees/AddEmployeePage.tsx";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
  }, [isAuthenticated]);

  return (
    <Router>
      {isAuthenticated ? (
        <MainLayout isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated}>
          <Routes>
            <Route path="/" element={<OrganizationPage />} />
            <Route path="/departments" element={<DepartmentPage />} />
            <Route path="/departments/:id" element={<DepartmentDetailPage />} />
            <Route path="/employees" element={<EmployeesPage />} />
            <Route path="/employees/edit/:id" element={<EditEmployeePage />} />
            <Route path="/employees/add" element={<AddEmployeePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
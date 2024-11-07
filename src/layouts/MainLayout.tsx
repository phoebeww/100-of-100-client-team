import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Users, Building2, LayoutDashboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; 
interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              HR Management System
            </h1>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-16 items-center">
            <Link 
              to="/" 
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            
            <Link 
              to="/departments" 
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <Building2 className="w-5 h-5 mr-2" />
              Departments
            </Link>
            
            <Link 
              to="/employees" 
              className="flex items-center text-gray-700 hover:text-gray-900"
            >
              <Users className="w-5 h-5 mr-2" />
              Employees
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            {children}
          </div>
        </div>
      </main>

      {/* Error Alert Component */}
      <div className="fixed bottom-4 right-4">
        <Alert variant="destructive" className="hidden">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default MainLayout;
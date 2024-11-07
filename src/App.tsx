// App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import MainLayout from './layouts/MainLayout';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

const Home = () => (
    <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to HR Management System</h1>
        <p>Select an option from the menu to get started.</p>
    </div>
);

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <Router>
            {isAuthenticated ? (
                <MainLayout isAuthenticated={isAuthenticated}>
                    <Routes>
                        <Route path="/main" element={<Home />} />
                        {/* Add other protected routes here */}
                    </Routes>
                </MainLayout>
            ) : (
                <MainLayout isAuthenticated={isAuthenticated}>
                    <Routes>
                        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Routes>
                </MainLayout>
            )}
        </Router>
    );
}

export default App;

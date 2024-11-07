import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

const Home = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Welcome to HR Management System</h1>
    <p>Select an option from the menu to get started.</p>
  </div>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* add more later */}
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
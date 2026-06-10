// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import ChurchDetailPage from './pages/ChurchDetailPage';
import ContactsPage from './pages/ContactsPage';
import AboutPage from './pages/AboutPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/common/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="App">
            <Header />
            <main className="fade-in">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/church/:id" element={<ChurchDetailPage />} />
                <Route path="/contacts" element={<ContactsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import StockEntry from './pages/StockEntry';
import CashCounter from './pages/CashCounter';
import Navigation from './Components/Navigation';
import Signup from './pages/Signup';
import Home from './pages/Home';
import GlobalState, { GlobalContext } from './context/globalContext';
import { useContext } from 'react';
import Login from './pages/Login';
import AllStocks from './pages/AllStocks';
import InitialCash from './pages/InitialCash';
import CashSummary from './pages/CashSummary';
import SplashScreen from './Components/Splash';
import LogoOverlay from './Components/ImageOverlay';
import { ThemeProvider } from './context/ThemeContext';

const AppRoutes = () => {
  const { isAuthUser, isRegistered, loading } = useContext(GlobalContext);
  const location = useLocation(); // ✅ useLocation inside BrowserRouter

  const hideNavRoutes = ['/'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <>
      {shouldShowNav && <Navigation />}
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route
          path="/home"
          element={
            isAuthUser ? (
              <Home />
            ) : (
              <Navigate to={isRegistered ? '/login' : '/signup'} replace />
            )
          }
        />
        <Route path="/stock-entry" element={<StockEntry />} />
        <Route path="/cash-counter" element={<CashCounter />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/all-stocks" element={<AllStocks />} />
        <Route path="/initial-cash" element={<InitialCash />} />
        <Route path="/cash-summary" element={<CashSummary />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <GlobalState>
        <BrowserRouter>
        
          <div>
            <AppRoutes />
            <LogoOverlay />
          </div>

        </BrowserRouter>
      </GlobalState>
    </ThemeProvider>

  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import LendPage from "./pages/lend/LendPage";
import IborrowedPage from "./pages/iborrowed/IborrowedPage";
import MyChatPages from "./pages/mychat/MyChatPages";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import RegisterPage from "./pages/login/RegisterPage";
import EmailVerificationPage from "./pages/login/EmailVerificationPage";
import CategoryProductsPage from "./pages/product/CategoryProductsPage";

function PrivateRoute({ children }) {
  const { user } = useUser();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/Iborrowed" element={<IborrowedPage />} />
          <Route path="/lend" element={<LendPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/mychat" element={<MyChatPages />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route path="/category/:id" element={<CategoryProductsPage />} />

        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;

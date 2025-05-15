import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import LoginPage from "./pages/login/LoginPage";
import HomePage from "./pages/home/HomePage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import LendPage from "./pages/lend/LendPage";
import SettingsPage from "./pages/settings/SettingsPage";
import ChatPage from "./pages/chat/ChatPage";
import LendAddPage from "./pages/lend/LendAddPage";
import ProductEditPage from "./pages/lend/ProductEditPage";
import IborrowedPage from "./pages/iborrowed/IborrowedPage";
import MyChatPages from "./pages/mychat/MyChatPages";
import NotificationsPage from "./pages/notifications/NotificationsPage";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import RegisterPage from "./pages/login/RegisterPage";
import EmailVerificationPage from "./pages/login/EmailVerificationPage";
import CategoryProductsPage from "./pages/product/CategoryProductsPage";
import ProfillePage from "./pages/profille/ProfillePage";

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
          <Route path="/chat/:chatId" element={<ChatPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/Iborrowed" element={<IborrowedPage />} />
          <Route path="/lend" element={<LendPage />} />
          <Route path="/lendAdd" element={<LendAddPage />} />
          <Route path="/edit/:id" element={<ProductEditPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/mychat" element={<MyChatPages />} />
          <Route path="/myprofille" element={<ProfillePage />} />
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

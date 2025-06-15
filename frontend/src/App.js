import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
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
import ForgetPassword from "./pages/login/ForgetPassword";
import CategoryProductsPage from "./pages/product/CategoryProductsPage";
import ProfillePage from "./pages/profille/ProfillePage";
import ResetPasswordPage from "./pages/login/ResetPassword";
import ChatWidget from "./components/ChatWidget/ChatWidget";



function AppContent() {
  const location = useLocation();
  console.log(location.pathname);
  
  const chatBlockRoutes = [
    "/", "/register", "/verify-email", "/forget-password"
  ];
  
  const shouldBlockChat = chatBlockRoutes.includes(location.pathname) || 
                         location.pathname.startsWith("/password-reset-confirm/") ||   location.pathname.startsWith("/chat");
  

  
  return (
    <>
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
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/category/:id" element={<CategoryProductsPage />} />
        <Route path="/password-reset-confirm/:token" element={<ResetPasswordPage />} />
      </Routes>
      {!shouldBlockChat && <ChatWidget />}
    </>
  );
}

function App() {
  return (
    <Router>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </Router>
  );
}

export default App;
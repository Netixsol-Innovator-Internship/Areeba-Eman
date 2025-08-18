import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/layouts/Header/page";
import Footer from "./components/layouts/Footer/page";
import Home from "./pages/home";
import PublicRoute from "./components/shared/common/PublicRoute";
import LoginForm from "./components/forms/loginForm";
import SignupForm from "./components/forms/signupForm";
import ProductsPage from "./pages/productsPage";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SingleProductPage from "./pages/singleProductPage";

import BagPage from "./pages/BagPage";
import ProtectedRoute from "./components/shared/common/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<ProductsPage />} />
        <Route path="/product/:slug" element={<SingleProductPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <BagPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupForm />
            </PublicRoute>
          }
        />
      </Routes>
      <Footer />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;

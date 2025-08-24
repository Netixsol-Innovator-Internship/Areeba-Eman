import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { useSelector } from "react-redux";
import { ROLES } from "./utils/roles";
import AdminDashboard from "./pages/admin/AdminDashboard";
import SuperAdminDashboard from "./pages/admin/superAdminDashboard";

function DashboardRouter() {
  const { user } = useSelector((s) => s.auth);
  if (user?.role === ROLES.SUPER_ADMIN) return <SuperAdminDashboard />;
  if (user?.role === ROLES.ADMIN) return <AdminDashboard />;
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product/:slug" element={<SingleProductPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <BagPage />
            </ProtectedRoute>
          }
        />

        {/* Admin + SuperAdmin */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.SUPER_ADMIN]}>
              <DashboardRouter />
            </ProtectedRoute>
          }
        />

        {/* Auth */}
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

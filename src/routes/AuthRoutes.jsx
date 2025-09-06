import { Routes, Route } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import LoginForm from "../components/auth/LoginForm";
import Logout from "../components/auth/Logout"
import AuthStatusTester from "../components/auth/Logout";

function AuthRoutes() {
  return (
    <Routes>
      <Route path="login" element={<LoginForm />} />
      <Route path="register" element={<RegisterForm />} />
      <Route path="logout" element={<Logout />} />
      <Route path="status" element={<AuthStatusTester />} />
    </Routes>
  );
}

export default AuthRoutes;

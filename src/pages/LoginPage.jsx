import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";

function LoginPage() {
  return (
      <div className="d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
          <div className="container">
            {/* Информативный блок */}
            <div className="alert alert-warning text-center mb-4" role="alert">
              Время сессии истекло, необходимо авторизоваться заново.<br />
              Если вы не зарегистрированы — пройдите регистрацию по{" "}
              <Link to="/register" className="alert-link">
                данной ссылке
              </Link>.
            </div>

            {/* Карточка с формой авторизации */}
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="card shadow">
                  <div className="card-body">
                    <h3 className="card-title mb-4 text-center">Авторизация</h3>
                    <LoginForm />

                    {/* Ссылка на сброс пароля */}
                    <div className="text-center mt-3">
                      <Link to="/pass-reset" className="text-decoration-none">
                        🔒 Забыли пароль?
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}

export default LoginPage;

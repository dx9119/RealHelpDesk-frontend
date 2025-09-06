import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import RegisterForm from "../components/auth/RegisterForm";
import {Link} from "react-router-dom";

function RegisterPage() {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />

            <main className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <div className="card shadow border-0">
                                <div className="card-body p-4">
                                    <h2 className="mb-4 text-center text-primary">Регистрация</h2>

                                    <RegisterForm />

                                    <p className="mt-3 text-muted text-center">
                                        Уже есть аккаунт? <a href="/login" className="text-decoration-none">Войти</a>
                                    </p>
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

export default RegisterPage;

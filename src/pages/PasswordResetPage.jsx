import React, { useState } from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import axiosInstance from "../services/axiosInstance";
import { Link, useLocation, useNavigate } from "react-router-dom";

function PasswordResetPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const resetCode = queryParams.get("code");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showGenerated, setShowGenerated] = useState(false);
    const [statusMessage, setStatusMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const generatePassword = () => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let generated = "";
        for (let i = 0; i < 12; i++) {
            generated += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(generated);
        setConfirmPassword(generated);
        setShowGenerated(true);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setErrorMessage("");
        setLoading(true);

        try {
            const response = await axiosInstance.post("/api/v1/user/passwd-reset/request", {
                email
            });

            const сообщение = response.data?.["Сообщение"];
            const статус = response.data?.["Статус"];

            if (сообщение?.includes("Исчерпан лимит")) {
                setErrorMessage("🚫 Исчерпан лимит на количество запросов восстановления. Попробуйте снова через 24 часа.");
            } else if (статус === "Успех") {
                setStatusMessage("📧 Письмо для сброса пароля отправлено на указанный адрес.");
            } else {
                setErrorMessage("⚠️ Не удалось отправить запрос. Попробуйте позже.");
            }
        } catch (err) {
            const errorMessageFromServer = err.response?.data?.["Сообщение"];

            if (errorMessageFromServer?.includes("Исчерпан лимит")) {
                setErrorMessage("🚫 Исчерпан лимит на количество запросов восстановления. Попробуйте снова через 24 часа.");
            } else {
                setErrorMessage("❌ Уточните почтовый адрес и попробуйте снова.");
            }

            console.error("Ошибка сброса пароля:", err);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage("");
        setErrorMessage("");
        setLoading(true);

        if (password !== confirmPassword) {
            setErrorMessage("❗ Пароли не совпадают.");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post(`/api/v1/user/passwd-reset/confirm?code=${resetCode}`, {
                password
            });

            if (response.data?.["Статус"] === "Успех") {
                setStatusMessage("✅ Пароль успешно обновлён. Сейчас вы будете перенаправлены на страницу входа...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setErrorMessage("⚠️ Не удалось обновить пароль. Попробуйте позже.");
            }
        } catch (err) {
            console.error("Ошибка установки нового пароля:", err);
            setErrorMessage("❌ Ошибка при сохранении пароля. Попробуйте позже.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
                <div className="container">
                    {!resetCode ? (
                        <div className="alert alert-info mb-4" role="alert">
                            <h5 className="text-center mb-3">🔐 Как сбросить пароль</h5>
                            <ul className="mb-2">
                                <li>Введите <strong>адрес электронной почты</strong> в поле ниже.</li>
                                <li>Нажмите кнопку <strong>"Запросить сброс пароля"</strong>.</li>
                                <li>Проверьте почту — придет письмо с <strong>ссылкой для сброса пароля</strong>.</li>
                                <li>Перейдите по ссылке и задайте новый пароль.</li>
                            </ul>
                            <p className="text-center mb-0">
                                Если вы ещё не зарегистрированы — пройдите регистрацию по{" "}
                                <Link to="/register" className="alert-link">этой ссылке</Link>.
                            </p>
                        </div>
                    ) : (
                        <div className="alert alert-info mb-4 text-center" role="alert">
                            🔑 Введите новый пароль и подтвердите его. Вы также можете сгенерировать безопасный пароль.
                        </div>
                    )}

                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card shadow">
                                <div className="card-body">
                                    {statusMessage && (
                                        <div className="alert alert-success text-center" role="alert">
                                            {statusMessage}
                                        </div>
                                    )}
                                    {errorMessage && (
                                        <div className="alert alert-danger text-center" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}

                                    {!resetCode ? (
                                        <form onSubmit={handleEmailSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="btn btn-primary w-100"
                                                disabled={loading}
                                            >
                                                {loading ? "Отправка..." : "Запросить сброс пароля"}
                                            </button>
                                        </form>
                                    ) : (
                                        <form onSubmit={handlePasswordSubmit}>
                                            <div className="mb-3">
                                                <label htmlFor="password" className="form-label">Новый пароль</label>
                                                <input
                                                    type={showGenerated ? "text" : "password"}
                                                    className="form-control"
                                                    id="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
                                                <input
                                                    type={showGenerated ? "text" : "password"}
                                                    className="form-control"
                                                    id="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between mb-3">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={generatePassword}
                                                >
                                                    🔄 Сгенерировать пароль
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-primary"
                                                    disabled={loading}
                                                >
                                                    {loading ? "Сохранение..." : "Сохранить новый пароль"}
                                                </button>
                                            </div>
                                        </form>
                                    )}
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

export default PasswordResetPage;

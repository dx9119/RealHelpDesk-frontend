import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";

function HomePage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
                <div className="container py-5">
                    {/* Приветствие */}
                    <div className="text-center mb-5">
                        <h2 className="mb-3">👋 Добро пожаловать в RealHelpDesk!</h2>
                        <p className="mt-4">
                            Если вы впервые здесь — загляните в <a href="https://RealHelpDesk.ru/faq" className="text-info fw-bold" target="_blank" rel="noopener noreferrer">Базу знаний (FAQ)</a>, чтобы узнать, как пользоваться системой.
                        </p>
                    </div>

                    {/* Информационный блок о бета-тесте */}
                    <div className="card shadow-sm border-warning mb-4">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">⚠️ Внимание: открытый бета-тест</h5>
                        </div>
                        <div className="card-body">
                            <p className="mb-3">
                                <strong>RealHelpDesk</strong> находится на стадии открытого бета-тестирования. Это означает, что сервис всё ещё дорабатывается и может содержать ошибки или работать нестабильно.
                            </p>
                            <div className="row">
                                <div className="col-md-6">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">🚫</li>
                                        <li className="list-group-item"></li>
                                    </ul>
                                </div>
                                <div className="col-md-6">
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">📉 Возможна <strong>потеря или удаление данных</strong> в процессе тестирования.</li>
                                        <li className="list-group-item">🛠 Задача бета-тестирование <strong>сбор обратной связи</strong> для улучшения системы.</li>
                                    </ul>
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

export default HomePage;

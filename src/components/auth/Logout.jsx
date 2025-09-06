import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // импорт навигации
import axiosInstance from "../../services/axiosInstance";

const LogoutButton = () => {
  const [authorized, setAuthorized] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate(); // хук для редиректа

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const res = await axiosInstance.get("/api/v1/health-check", { withCredentials: true });
        if (res.status === 200 && res.data["Статус"] === "Активен") {
          setAuthorized(true);
        } else {
          setAuthorized(false);
        }
      } catch (err) {
        console.warn("Ошибка при проверке авторизации:", err.response?.data || err.message);
        setAuthorized(false);
      }
    };
    checkAuthorization();
  }, []);


  const handleLogout = async () => {
    try {
      const response = await axiosInstance.delete("/api/v1/auth/cookies", {
        withCredentials: true
      });

      if (response.data?.["Статус"] === "Успех") {
        setStatusMessage("✅ Вы успешно вышли из системы");
        setErrorMessage(null);
        setAuthorized(false);

        // редирект через 1 секунду
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        throw new Error("Ответ не подтверждён");
      }
    } catch (error) {
      console.error("Ошибка выхода:", error);
      setErrorMessage("❌ Не удалось завершить сеанс");
      setStatusMessage(null);
    }
  };


  return (
      <div className="mt-3">
        {authorized && (
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              Завершить сеанс (выйти из профиля)
            </button>
        )}
        {statusMessage && <div style={{ color: "green", marginTop: "0.5rem" }}>{statusMessage}</div>}
        {errorMessage && <div style={{ color: "red", marginTop: "0.5rem" }}>{errorMessage}</div>}
      </div>
  );
};

export default LogoutButton;

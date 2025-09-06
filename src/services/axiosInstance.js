import axios from 'axios';
import { HOST } from './authService';

const axiosInstance = axios.create({
    baseURL: HOST,
    withCredentials: true,
});

// Флаг, показывающий, что процесс обновления токена уже запущен
let isRefreshing = false;
// Очередь запросов, которые ждут обновления токена
let failedQueue = [];

/**
 * Обрабатывает очередь "зависших" запросов.
 * @param {Error|null} error - Ошибка, если обновление токена не удалось.
 */
const processQueue = (error) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve();
        }
    });
    failedQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;

        // --- Логика обновления токена ---
        if (status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => axiosInstance(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.post('/api/v1/auth/update');
                processQueue(null);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);
                console.error('Token refresh failed. Redirecting to /login.', refreshError);
                window.location.replace('/login');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // --- Обработка других ошибок с редиректом и передачей данных ---
        const errorInfo = {
            status: status || 'NETWORK_ERROR',
            message: error.message,
            url: originalRequest.url,
        };
        const queryParams = new URLSearchParams(errorInfo).toString();

        let redirectUrl;
        switch (status) {
            case 403:
                redirectUrl = `/403page?${queryParams}`;
                break;
            case 409:
                // Ошибка конфликта — пропускаем редирект и отдадим ошибку дальше
                break;
            case 418:
                redirectUrl = `/418page?${queryParams}`;
                break;
            case 500:
                redirectUrl = `/500page?${queryParams}`;
                break;
            default:
                //redirectUrl = `/some-error?${queryParams}`;
                break;
        }

        // Если redirectUrl определён — делаем редирект
        if (redirectUrl) {
            console.warn(`Redirecting to: ${redirectUrl}`);
            window.location.href = redirectUrl;
            // возвращаем "вечный" промис, чтобы остановить цепочку
            return new Promise(() => {});
        }

        // Для 409 и любых других случаев без редиректа — пробрасываем ошибку дальше
        return Promise.reject(error);
    }
);

export default axiosInstance;
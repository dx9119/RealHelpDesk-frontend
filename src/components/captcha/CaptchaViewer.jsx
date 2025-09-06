import React, { useState, useEffect, useRef, useCallback } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { v4 as uuidv4 } from 'uuid';

const CaptchaViewer = ({ onCaptchaIdChange }) => {
    const [captchaImageUrl, setCaptchaImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState('');

    // Этот ref будет хранить контроллер для отмены текущего запроса
    const abortControllerRef = useRef(null);

    const loadCaptcha = useCallback(async () => {
        // Если уже идет загрузка, отменяем предыдущий запрос
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Создаем и сохраняем новый контроллер
        const controller = new AbortController();
        abortControllerRef.current = controller;

        const id = uuidv4().slice(0, 10);
        setLoading(true);
        setErrorText('');

        try {
            const response = await axiosInstance.get(`/api/v1/captcha?capId=${id}`, {
                responseType: 'arraybuffer',
                withCredentials: true,
                signal: controller.signal, // Передаем сигнал для возможности отмены
            });

            // Освобождаем старый URL, чтобы избежать утечек памяти
            if (captchaImageUrl) {
                URL.revokeObjectURL(captchaImageUrl);
            }

            const blob = new Blob([response.data], { type: 'image/jpeg' });
            const imageUrl = URL.createObjectURL(blob);

            setCaptchaImageUrl(imageUrl);

            if (onCaptchaIdChange) {
                onCaptchaIdChange(id);
            }
        } catch (error) {
            // Игнорируем ошибку, если она вызвана отменой запроса
            if (error.name !== 'CanceledError') {
                setErrorText('Ошибка загрузки CAPTCHA');
                // Очищаем старую картинку в случае ошибки
                setCaptchaImageUrl('');
            }
        } finally {
            // Устанавливаем loading в false только если это был последний запрос
            if (abortControllerRef.current === controller) {
                setLoading(false);
            }
        }
    }, [onCaptchaIdChange, captchaImageUrl]); // Добавляем captchaImageUrl в зависимости useCallback

    // Эффект для первоначальной загрузки
    useEffect(() => {
        loadCaptcha();

        // Функция очистки, которая сработает при размонтировании компонента
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            // Очистка последнего созданного URL
            if (captchaImageUrl) {
                URL.revokeObjectURL(captchaImageUrl);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Пустой массив, чтобы эффект выполнился один раз при монтировании

    const refreshCaptcha = () => {
        loadCaptcha();
    };

    return (
        <div className="container my-3">
            <div className="card p-3 shadow-sm">
                <h5 className="mb-3">Капча</h5>
                <div className="text-center mb-3" style={{ minHeight: '50px' }}>
                    {loading ? (
                        <div className="text-muted">Загрузка...</div>
                    ) : captchaImageUrl ? (
                        <img
                            src={captchaImageUrl}
                            alt="CAPTCHA"
                            className="img-fluid border rounded"
                        />
                    ) : (
                        <div className="text-danger">{errorText}</div>
                    )}
                </div>
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-outline-primary"
                        onClick={refreshCaptcha}
                        disabled={loading} // Блокируем кнопку во время загрузки
                    >
                        🔄 Обновить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CaptchaViewer;
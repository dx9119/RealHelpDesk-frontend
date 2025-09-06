import React, { useEffect, useState, useCallback } from 'react';
import { Container, Row, Col, Card, Spinner, Alert, Form, Button } from 'react-bootstrap';
import axiosInstance from '../../services/axiosInstance';
import { HOST } from '../../services/authService';
import Logout from "../auth/Logout";

function UserAccount() {
    // Состояния для данных профиля
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        additionalInfo: '',
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');
    const [copied, setCopied] = useState(false);

    // --- Состояния для подтверждения Email и CAPTCHA ---
    const [verificationCode, setVerificationCode] = useState('');
    const [capId, setCapId] = useState('');
    const [capCode, setCapCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState('');
    const [loadingVerify, setLoadingVerify] = useState(false);
    const [canResend, setCanResend] = useState(false); // Изначально false, пока не загрузим CAPTCHA
    const [resendTimer, setResendTimer] = useState(0);

    // Функция для получения новой CAPTCHA
    const fetchCaptcha = useCallback(async () => {
        try {
            const res = await axiosInstance.get(`${HOST}/api/v1/captcha/get-new`);
            setCapId(res.data.id);
            // После получения нового CAPTCHA, разрешаем повторную отправку
            setCanResend(true);
        } catch (err) {
            console.error('Ошибка при получении CAPTCHA:', err);
            setVerifyStatus('⛔ Не удалось загрузить CAPTCHA. Попробуйте обновить страницу.');
        }
    }, []);

    // Эффект для загрузки профиля и CAPTCHA при монтировании компонента
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get(`${HOST}/api/v1/user/profile`, { withCredentials: true });
                setProfile(res.data);
                setFormData({
                    firstName: res.data.firstName || '',
                    lastName: res.data.lastName || '',
                    middleName: res.data.middleName || '',
                    additionalInfo: res.data.additionalInfo || '',
                });
            } catch (err) {
                setError(
                    <>
                        ❌ Не удалось выполнить. Возможно, ваша сессия устарела. Просто <a href="/login">выполните авторизацию повторно</a>.
                    </>
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchCaptcha(); // Загружаем CAPTCHA сразу
    }, [fetchCaptcha]);

    // Эффект для таймера повторной отправки кода
    useEffect(() => {
        let timer;
        if (resendTimer > 0) {
            timer = setInterval(() => {
                setResendTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [resendTimer]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setStatus('');
        try {
            await axiosInstance.post('/api/v1/user/profile', formData);
            setStatus('✅ Данные успешно обновлены');
            setProfile(prev => ({
                ...prev,
                ...formData,
            }));
        } catch (err) {
            console.error('⛔ Ошибка:', err);
            setStatus('Ошибка при обновлении профиля');
        } finally {
            setUpdating(false);
        }
    };

    const copyToClipboard = () => {
        // Заменено на более надежный способ, который работает в iframe
        const el = document.createElement('textarea');
        el.value = profile.id;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);

        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // --- Обработчики для подтверждения Email и CAPTCHA ---
    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        const trimmedCode = verificationCode.trim();
        if (!trimmedCode) {
            setVerifyStatus('⚠️ Введите код из письма');
            return;
        }
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedCode)) {
            setVerifyStatus('⚠️ Неверный формат кода. Проверьте код и попробуйте снова.');
            return;
        }
        setLoadingVerify(true);
        setVerifyStatus('');
        try {
            const res = await axiosInstance.get(`/api/v1/email/confirm?token=${trimmedCode}`);
            setVerifyStatus(res.data === 'Успешно' ? '✅ Email успешно подтверждён!' : `Ответ сервера: ${res.data}`);
            if (res.data === 'Успешно') {
                setProfile(prev => ({ ...prev, emailVerified: true }));
            }
        } catch (err) {
            console.error('Ошибка при подтверждении email:', err);
            setVerifyStatus('⛔ Не удалось подтвердить email. Код может быть неверным или устаревшим.');
        } finally {
            setLoadingVerify(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend) return;
        if (!capId || !capCode.trim()) {
            setVerifyStatus('⚠️ Введите текст с картинки (CAPTCHA), чтобы отправить код.');
            return;
        }
        setCanResend(false);
        setVerifyStatus('Отправляем код...');
        setResendTimer(60);
        try {
            const res = await axiosInstance.get(`/api/v1/email/code?capId=${capId}&capCode=${encodeURIComponent(capCode)}`);
            setVerifyStatus(res.data === 'Успешно' ? '📨 Новый код был отправлен на ваш email.' : `⚠️ Ответ сервера: ${res.data}`);
            if (res.data !== 'Успешно') {
                // Если сервер вернул ошибку, делаем CAPTCHA снова кликабельной и обнуляем таймер
                setCanResend(true);
                setResendTimer(0);
            }
        } catch (err) {
            const errorMsg = err?.response?.data?.message || '⛔ Не удалось повторно отправить код. Попробуйте обновить страницу.';
            setVerifyStatus(errorMsg);
            setCanResend(true);
            setResendTimer(0);
        } finally {
            setCapCode('');
            fetchCaptcha(); // Загружаем новую CAPTCHA после попытки отправки
        }
    };

    if (loading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;

    return (
        <Container className="my-5">
            <Row>
                <Col md={6}>
                    <Card className="shadow mb-4 text-start">
                        <Card.Header className="bg-primary text-white">Профиль</Card.Header>
                        <div className="mb-2 p-2 bg-light border rounded">
                            Внимание, данные указаны условно - для целей открытого бета-тестирования.
                        </div>
                        <Card.Body>
                            <div className="mb-2 p-2 bg-light border rounded">
                                <p><strong>Имя:</strong> {profile.firstName}</p>
                                <p><strong>Фамилия:</strong> {profile.lastName}</p>
                                <p><strong>Отчество:</strong> {profile.middleName || '—'}</p>
                                <p><strong>Роль:</strong> {profile.userRole}</p>
                            </div>
                            <div className="mb-2 p-2 bg-light border rounded">
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p>
                                    <strong>Email подтверждён:</strong>{' '}
                                    {profile.emailVerified ? '✅ Да' : (
                                        <>
                                            ❌ Нет (
                                            <a href="/notify-settings">Подтвердить</a>
                                            )
                                        </>
                                    )}
                                </p>

                            </div>
                            <div className="mb-2 p-2 bg-light border rounded d-flex justify-content-between align-items-center">
                                <div>
                                    <p><strong>Ваш ID:</strong></p>
                                    <div style={{ whiteSpace: 'pre-wrap' }}>
                                        {profile.id}
                                    </div>
                                </div>
                                <button
                                    className="btn btn-outline-secondary btn-sm ms-2"
                                    onClick={copyToClipboard}
                                >
                                    📋 Копировать
                                </button>
                            </div>
                            <div className="mb-3">
                                <Logout></Logout>
                            </div>
                            {copied && <div className="text-success mt-2">ID скопирован!</div>}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={6}>
                    <Card className="shadow mb-4">
                        <Card.Header className="bg-success text-white">✍️ Редактировать профиль</Card.Header>
                        <div className="mb-2 p-2 bg-light border rounded">
                            Выдумайте ФИО, например: Карандашик Печенюшкин
                        </div>
                        <Card.Body>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Имя</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Фамилия</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Отчество</label>
                                    <input
                                        type="text"
                                        name="middleName"
                                        value={formData.middleName}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Доп. информация</label>
                                    <textarea
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleChange}
                                        rows="3"
                                        className="form-control"
                                    />
                                </div>
                                <button type="submit" className="btn btn-success" disabled={updating}>
                                    {updating ? 'Отправка...' : 'Сохранить изменения'}
                                </button>
                            </form>
                            {status && <div className="mt-3 alert alert-info">{status}</div>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default UserAccount;

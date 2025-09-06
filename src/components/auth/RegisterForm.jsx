import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import { Form, Button, Alert, Container, Card, InputGroup } from 'react-bootstrap';
import CaptchaViewer from '../captcha/CaptchaViewer';

const RegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    capCode: ''
  });

  const [message, setMessage] = useState(null);
  const [showGenerated, setShowGenerated] = useState(false);
  const [captchaId, setCaptchaId] = useState('');

  const handleCaptchaIdChange = (newId) => {
    setCaptchaId(newId);
    console.log('Текущий captchaId:', newId);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generatePassword = () => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    setForm({ ...form, password });
    setShowGenerated(true);
  };

  const togglePasswordVisibility = () => {
    setShowGenerated(!showGenerated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaId || !form.capCode.trim()) {
      setMessage({ type: 'danger', text: 'Введите текст с картинки CAPTCHA.' });
      return;
    }

    const { firstName, lastName, email, password, capCode } = form;

    try {
      const response = await registerUser({ firstName, lastName, email, password, capCode }, captchaId);

      // Проверка на ошибку отправки email
      const emailFailed =
          response?.message?.toLowerCase().includes('ошибка при отправке email') ||
          response?.emailSent === false;

      setMessage({
        type: 'success',
        text: emailFailed
            ? 'Аккаунт успешно создан, но письмо не удалось отправить. Вы можете войти вручную.'
            : response.message || 'Регистрация прошла успешно!'
      });

      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      const errorMsg = error?.response?.data?.message;

      if (errorMsg === 'Ошибка при отправке email') {
        setMessage({
          type: 'warning',
          text: 'Аккаунт успешно создан, но письмо не удалось отправить. Вы можете войти вручную.'
        });

        setTimeout(() => {
          navigate('/');
        }, 1500);
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          capCode: ''
        }));

        setMessage({ type: 'danger', text: errorMsg || 'Ошибка регистрации. Попробуйте позже.' });
      }
    }
  };

  return (
      <Container className="mt-5">
        <Card className="mb-4 border-warning">
          <Card.Header className="bg-warning text-dark">
            Регистрация подтверждает ваше согласие на участие в открытом бета-тестировании платформы «Заявус».
          </Card.Header>
          <Card.Body>
            <ul>
              <li>🚫 Важно: не указывайте реальные персональные данные, используйте вымышленные имена и email!</li>
              <li>🛠 Цель регистрации — участие в тестировании.</li>
              <li>📉 Возможна потеря данных, стабильность не гарантируется.</li>
            </ul>
          </Card.Body>
        </Card>

        <CaptchaViewer onCaptchaIdChange={handleCaptchaIdChange} />

        <Form.Control
            name="capCode"
            placeholder="Введите текст с картинки"
            value={form.capCode}
            onChange={handleChange}
            className="mb-3"
        />

        {message && <Alert variant={message.type}>{message.text}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Control
              name="firstName"
              placeholder="Имя"
              value={form.firstName}
              onChange={handleChange}
              className="mb-2"
          />
          <Form.Control
              name="lastName"
              placeholder="Фамилия"
              value={form.lastName}
              onChange={handleChange}
              className="mb-2"
          />
          <Form.Control
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="mb-2"
          />

          <InputGroup className="mb-2">
            <Form.Control
                name="password"
                type={showGenerated ? 'text' : 'password'}
                placeholder="Пароль (можно сгенерировать)"
                value={form.password}
                onChange={handleChange}
            />
            <Button variant="outline-secondary" onClick={generatePassword}>
              🔄 Сгенерировать
            </Button>
            <Button variant="outline-secondary" onClick={togglePasswordVisibility}>
              {showGenerated ? '🙈 Скрыть' : '👁 Показать'}
            </Button>
          </InputGroup>

          <Button type="submit" variant="primary">
            Принять участие
          </Button>
        </Form>
      </Container>
  );
};

export default RegisterPage;

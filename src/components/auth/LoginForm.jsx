import React, { useState } from 'react';
import { loginUser } from '../../services/authService';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const LoginForm = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);

      // если сервер возвращает "Статус" и "Сообщение"
      setMessage({ type: response["Статус"] === "Успех" ? 'success' : 'info', text: response["Сообщение"] });

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      const errorMsg = error.response?.data?.["Сообщение"] || "Ошибка при авторизации";
      setMessage({ type: 'danger', text: errorMsg });
    }
  };


  return (
    <Container className="mt-5">
      <h3>Вход</h3>
      {message && <Alert variant={message.type}>{message.text}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Control name="email" type="email" placeholder="Email" onChange={handleChange} className="mb-2" />
        <Form.Control name="password" type="password" placeholder="Пароль" onChange={handleChange} className="mb-3" />
        <Button type="submit" variant="success">Войти</Button>
      </Form>
    </Container>
  );
};

export default LoginForm;

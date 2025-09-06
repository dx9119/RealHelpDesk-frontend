import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { Card, Spinner, Alert, Container } from 'react-bootstrap';
import { HOST } from '../../services/authService';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 
  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get(HOST+'/api/v1/user/profile', {
        withCredentials: true,
      });
      setProfile(response.data);
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

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  }

  if (error) {
    return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
  }

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header className="bg-primary text-white">Профиль пользователя</Card.Header>
        <Card.Body>
          <Card.Text><strong>Имя:</strong> {profile.firstName}</Card.Text>
          <Card.Text><strong>Фамилия:</strong> {profile.lastName}</Card.Text>
          <Card.Text><strong>Email:</strong> {profile.email}</Card.Text>
          <Card.Text><strong>ID:</strong> {profile.id}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;

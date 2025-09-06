import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function UserProfileForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    additionalInfo: '',
  });
  const [responseInfo, setResponseInfo] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      const res = await axiosInstance.post('/api/v1/user/profile', formData);
      setResponseInfo(res.data);
      setStatus('✅ Данные успешно обновлены');
    } catch (err) {
      console.error('⛔ Ошибка:', err);
      setStatus('Ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4>Редактировать профиль</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Имя</label>
          <input
            type="text"
            name="firstName"
            className="form-control"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Фамилия</label>
          <input
            type="text"
            name="lastName"
            className="form-control"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Отчество</label>
          <input
            type="text"
            name="middleName"
            className="form-control"
            value={formData.middleName}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label>Доп. информация</label>
          <textarea
            name="additionalInfo"
            className="form-control"
            rows="3"
            value={formData.additionalInfo}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Обновить данные'}
        </button>
      </form>

      {status && <div className="mt-3 alert alert-info">{status}</div>}

      {responseInfo && (
        <div className="mt-3 alert alert-secondary">
          <strong>Email:</strong> {responseInfo.email}<br />
          <strong>Статус:</strong> {responseInfo.userStatus}<br />
          <strong>Роль:</strong> {responseInfo.userRole}<br />
          <strong>Подтверждён:</strong> {responseInfo.emailVerified ? '✅ Да' : '❌ Нет'}
        </div>
      )}
    </div>
  );
}

export default UserProfileForm;

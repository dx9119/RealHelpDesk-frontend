import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function CreatePortal() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const validateName = name => {
    if (!name.trim()) {
      return 'Название портала не может быть пустым';
    }
    if (name.length > 255) {
      return 'Название портала не может превышать 255 символов';
    }
    if (description.length > 2500) {
      return 'Описание портала не может превышать 2500 символов';
    }
    return '';
  };

  const formatServerError = err => {
    const data = err.response?.data;

    if (typeof data === 'object') {
      if (data["Сообщение"]) {
        return data["Сообщение"];
      }
      return <pre>{JSON.stringify(data, null, 2)}</pre>;
    }

    if (typeof data === 'string') {
      return data;
    }

    if (err.response?.status === 418) {
      return 'Лимит по количеству порталов достигнут. Для расширения лимита свяжитесь с администратором.';
    }

    return (
        <>
          ❌ Не удалось выполнить. Возможно, ваша сессия устарела. Просто <a href="/login">выполните авторизацию повторно</a>.
        </>
    );
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setError('');

    const nameError = validateName(name);
    if (nameError) {
      setError(nameError);
      return;
    }

    try {
      const res = await axiosInstance.post('/api/v1/portals', {
        name,
        description,
      });

      setMessage(res.data.message || 'Портал успешно создан!');
      setName('');
      setDescription('');

      // 🔄 Перезагрузка страницы после успешного создания
      window.location.reload();

    } catch (err) {
      console.error('Ошибка создания портала:', err);
      setError(formatServerError(err));
    }
  };

  return (
      <div className="mt-4">
        <h3>Создать портал</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Название</label>
            <input
                type="text"
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Описание</label>
            <textarea
                className="form-control"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Создать
          </button>
        </form>

        {message && <div className="alert alert-Успешно mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
  );
}

export default CreatePortal;

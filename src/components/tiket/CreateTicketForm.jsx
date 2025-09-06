import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

function CreateTicketForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const portalId = searchParams.get('portalId');

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [priority, setPriority] = useState('');
  const [accessStatus, setAccessStatus] = useState('CREATOR_AND_PORTAL_USERS');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const priorityLabels = {
    CRITICAL: 'Критический',
    HIGH: 'Высокий',
    MEDIUM: 'Средний',
    LOW: 'Низкий',
    NONE: 'Нет приоритета',
  };

  const priorities = Object.keys(priorityLabels);

  const accessStatusLabels = {
    ALL_USERS: 'Доступна всем пользователям',
    CREATOR_AND_PORTAL_USERS: 'Только мне и пользователям портала',
  };

  const accessStatusOptions = Object.keys(accessStatusLabels);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    // 🔒 Клиентская проверка длины
    if (title.length > 255) {
      setError('Тема заявки не может превышать 255 символов');
      setLoading(false);
      return;
    }

    if (body.length > 8000) {
      setError('Описание заявки не может превышать 8000 символов');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        title,
        body,
        ticketAccessStatus: accessStatus
      };

      if (priority) {
        payload.ticketPriority = priority;
      }

      const res = await axiosInstance.post(`/api/v1/portals/${portalId}/ticket`, payload);
      const serverMessage = res.data.message || 'Заявка успешно создана';
      const match = serverMessage.match(/ID:\s*(\d+)/);
      const createdTicketId = match ? match[1] : null;

      if (createdTicketId) {
        setMessage(`✅ Заявка успешно создана! ID заявки: ${createdTicketId}`);
        setTimeout(() => {
          navigate(`/ticket-show/portal/${portalId}/ticket/${createdTicketId}`);

        }, 500);
      } else {
        setMessage(serverMessage);
      }

      setTitle('');
      setBody('');
      setPriority('');
      setAccessStatus('CREATOR_AND_PORTAL_USERS');
    } catch (err) {
      console.error('⛔ Ошибка при создании заявки:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Не удалось создать заявку');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="mt-4">
        <h4>Создание заявки для портала {portalId ? `#${portalId}` : '(ID не задан)'}</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Заголовок</label>
            <input
                type="text"
                className="form-control"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={loading}
                maxLength={255}
                placeholder="Введите тему заявки (до 255 символов)"
            />
            <small className="text-muted">{title.length}/255 символов</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Описание</label>
            <textarea
                className="form-control"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                required
                disabled={loading}
                maxLength={8000}
                placeholder="Введите описание заявки (до 8000 символов)"
            />
            <small className="text-muted">{body.length}/8000 символов</small>
          </div>

          <div className="mb-3">
            <label className="form-label">Приоритет</label>
            <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                disabled={loading}
            >
              <option value="">Не задан</option>
              {priorities.map((p) => (
                  <option key={p} value={p}>
                    {priorityLabels[p]}
                  </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Настройка доступа</label>
            <select
                className="form-select"
                value={accessStatus}
                onChange={(e) => setAccessStatus(e.target.value)}
                disabled={loading}
            >
              {accessStatusOptions.map((key) => (
                  <option key={key} value={key}>
                    {accessStatusLabels[key]}
                  </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Отправка...' : 'Создать заявку'}
          </button>
        </form>

        {message && <div className="alert alert-Успешно mt-3">{message}</div>}
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </div>
  );
}

export default CreateTicketForm;

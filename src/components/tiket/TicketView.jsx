import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import dayjs from 'dayjs';

// Цвет и перевод приоритета
const getPriorityInfo = (priority) => {
  switch (priority) {
    case 'CRITICAL': return { label: 'Критический', color: 'red' };
    case 'HIGH': return { label: 'Высокий', color: 'orange' };
    case 'MEDIUM': return { label: 'Средний', color: 'gold' };
    case 'LOW': return { label: 'Низкий', color: 'green' };
    case 'NONE': return { label: 'Нет приоритета', color: 'gray' };
    default: return { label: 'Неизвестно', color: 'black' };
  }
};

// Цвет и перевод статуса
const getStatusInfo = (status) => {
  switch (status) {
    case 'OPEN': return { label: 'Открыта', color: 'green' };
    case 'IN_PROGRESS': return { label: 'В процессе', color: 'orange' };
    case 'CLOSED': return { label: 'Закрыта', color: 'gray' };
    default: return { label: 'Неизвестно', color: 'black' };
  }
};

// Переводы доступа
const accessStatusLabels = {
  ALL_USERS: 'Доступна всем пользователям',
  CREATOR_AND_PORTAL_USERS: 'Только у автора заявки и пользователей портала',
};

const PRIORITY_OPTIONS = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'NONE'];
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED'];

function TicketView({ portalId, ticketId }) {
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState('');
  const [showPriority, setShowPriority] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await axiosInstance.get(
            `/api/v1/portals/${portalId}/ticket/${ticketId}`
        );
        setTicket(response.data);
        setError('');
      } catch (err) {
        const data = err.response?.data;
        if (data?.Error === 'Access Denied' && data?.Source === 'Global handler') {
          setError('⛔ У вас нет доступа к порталу в рамках которого создана заявка.');
        } else {
          const msg = data?.Сообщение || data?.message || 'Ошибка при получении заявки';
          setError('❌ ' + msg);
        }
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    if (portalId && ticketId) {
      fetchTicket();
    }
  }, [portalId, ticketId]);

  const handleChange = async (type, value) => {
    setChanging(true);
    setMessage('');

    const endpoint =
        type === 'priority'
            ? `/api/v1/portals/${portalId}/ticket/set/priority/${ticketId}?priority=${value}`
            : `/api/v1/portals/${portalId}/ticket/set/status/${ticketId}?status=${value}`;

    try {
      const response = await axiosInstance.post(endpoint);
      if (response.data === 'Успех') {
        setMessage('✅ Успешно обновлено');
        setTicket((prev) => ({
          ...prev,
          ...(type === 'priority' ? { ticketPriority: value } : { ticketStatus: value }),
        }));
      } else {
        setMessage('⚠️ Не удалось обновить');
      }
    } catch (err) {
      setMessage('❌ Ошибка обновления: ' + (err.response?.data?.message || 'неизвестная ошибка'));
    } finally {
      setChanging(false);
    }
  };

  if (loading) return <p>⏳ Загрузка заявки...</p>;
  if (error) return <p className="alert alert-danger">{error}</p>;

  return (
      <div className="card shadow-sm my-4">
        <div className="card-body">
          <h4 className="card-title mb-3 text-primary">{ticket.title}</h4>

          <div className="row">
            <div className="col-md-6 mb-2">
              <strong>Портал:</strong>{' '}
              <span className="text-muted">{ticket.portalName} <small>(ID: {ticket.portalId})</small></span>
            </div>

            <div className="col-md-6 mb-2">
              <strong>ID заявки:</strong>{' '}
              <span className="text-muted">{ticket.id}</span>
            </div>

            <div className="col-md-6 mb-2">
              <strong>Автор:</strong> {ticket.authorFullName}
            </div>

            <div className="col-md-6 mb-2">
              <strong>Приоритет:</strong>{' '}
              <span style={{
                padding: '0.3rem 0.6rem',
                backgroundColor: getPriorityInfo(ticket.ticketPriority).color,
                color: 'white',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}>
              {getPriorityInfo(ticket.ticketPriority).label}
            </span>
            </div>

            <div className="col-md-6 mb-2">
              <strong>Статус:</strong>{' '}
              <span style={{
                padding: '0.3rem 0.6rem',
                backgroundColor: getStatusInfo(ticket.ticketStatus).color,
                color: 'white',
                borderRadius: '5px',
                fontWeight: 'bold'
              }}>
              {getStatusInfo(ticket.ticketStatus).label}
            </span>
            </div>

            <div className="col-md-6 mb-2">
              <strong>Доступ к заявке:</strong>{' '}
              <span className="text-muted">
              {accessStatusLabels[ticket.ticketAccessStatus] || 'Неизвестно'}
            </span>
            </div>

            <div className="col-md-6 mb-2">
              <p>
                <strong>Создано:</strong>{' '}
                {dayjs(ticket.createdAt).format('DD.MM.YYYY HH:mm')}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <h5 className="text-secondary">📄 Описание заявки:</h5>
            <div className="border rounded p-3 bg-light" style={{ whiteSpace: 'pre-wrap' }}>
              {ticket.body}
            </div>
          </div>

          {/* Сворачиваемый блок для приоритета */}
          <div className="mt-4">
            <h6
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPriority(!showPriority)}
            >
              Изменить приоритет {showPriority ? '▲' : '▼'}
            </h6>
            {showPriority && (
                <>
                  {PRIORITY_OPTIONS.map((p) => (
                      <button
                          key={p}
                          className="btn btn-sm me-2 mb-2"
                          style={{ backgroundColor: getPriorityInfo(p).color, color: 'white' }}
                          onClick={() => handleChange('priority', p)}
                          disabled={changing}
                      >
                        {getPriorityInfo(p).label}
                      </button>
                  ))}
                </>
            )}
          </div>

          {/* Сворачиваемый блок для статуса */}
          <div className="mt-3">
            <h6
                style={{ cursor: 'pointer' }}
                onClick={() => setShowStatus(!showStatus)}
            >
              Изменить статус {showStatus ? '▲' : '▼'}
            </h6>
            {showStatus && (
                <>
                  {STATUS_OPTIONS.map((s) => (
                      <button
                          key={s}
                          className="btn btn-sm me-2 mb-2"
                          style={{
                            backgroundColor: getStatusInfo(s).color,
                            color: 'white'
                          }}
                          onClick={() => handleChange('status', s)}
                          disabled={changing}
                      >
                        {getStatusInfo(s).label}
                      </button>
                  ))}
                </>
            )}
          </div>

          {message && <div className="alert alert-info mt-3">{message}</div>}

        </div>
      </div>
  );
}

export default TicketView;

import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

// Приглушённые тона
const COLORS = [
  '#c8d6e5', '#dfe6e9', '#fab1a0', '#ffeaa7',
  '#a29bfe', '#81ecec', '#b2bec3', '#fdcb6e',
  '#55efc4', '#74b9ff', '#e17055', '#636e72'
];

// Простая хэш-функция по строке
function stringToColorIndex(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % COLORS.length;
}

function MessagesList({ portalId, ticketId }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await axiosInstance.get(
            `/api/v1/message/${portalId}/${ticketId}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Ошибка при получении сообщений:', err);
        setError('⛔ Не удалось загрузить сообщения');
      } finally {
        setLoading(false);
      }
    }

    if (portalId && ticketId) {
      fetchMessages();
    }
  }, [portalId, ticketId]);

  return (
      <div className="mt-4">
        <h5 className="text-primary mb-3">💬 Сообщения по заявке №{ticketId}</h5>

        {loading ? (
            <div className="text-muted">⏳ Загрузка сообщений...</div>
        ) : error ? (
            <div className="alert alert-danger">{error}</div>
        ) : messages.length === 0 ? (
            <div className="alert alert-warning">📭 Сообщений пока нет</div>
        ) : (
            <div className="d-flex flex-column gap-3">
              {messages.map(({ id, messageText, authorFullName, createdAt }) => {
                const color = COLORS[stringToColorIndex(authorFullName || '')];
                return (
                    <div
                        key={id}
                        className="card shadow-sm"
                        style={{
                          borderLeft: `8px solid ${color}`
                        }}
                    >
                      <div className="card-body">
                        <h6
                            className="card-subtitle mb-2"
                            style={{
                              color: '#333',
                              backgroundColor: `${color}33`, // прозрачная подложка для имени
                              padding: '4px 8px',
                              borderRadius: '4px',
                              display: 'inline-block'
                            }}
                        >
                          {authorFullName}
                          <span className="text-muted float-end" style={{ background: 'transparent' }}>
                      {dayjs(createdAt).format('DD.MM.YYYY HH:mm')}
                    </span>
                        </h6>
                        <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>
                          {messageText}
                        </p>
                      </div>
                    </div>
                );
              })}
            </div>
        )}
      </div>
  );
}

export default MessagesList;

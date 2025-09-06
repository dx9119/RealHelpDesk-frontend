import { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';

const policyDescriptions = {
  NEW_TICKET: 'Не оповещать о новых заявках',
  NEW_MESSAGE: 'Не оповещать о сообщениях',
  NEW_SYSTEM_MESSAGE: 'Не оповещать о системных событиях',
  NEW_TICKET_OR_MESSAGE: 'Без заявок и сообщений',
  NONE: 'Получать все уведомления',
};

function EmailNotificationInfo() {
  const [currentLevel, setCurrentLevel] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMuteLevel = async () => {
      try {
        const res = await axiosInstance.get('/api/v1/email/info');
        setCurrentLevel(res.data.muteLevel);
        setStatus('✅ Текущий уровень уведомлений загружен');
      } catch (err) {
        console.error('⛔ Ошибка при получении muteLevel:', err);
        setStatus('Ошибка при загрузке уровня уведомлений');
      } finally {
        setLoading(false);
      }
    };

    fetchMuteLevel();
  }, []);

  return (
    <div className="mt-4">
      <h4>Текущий уровень email-уведомлений</h4>
      {loading ? (
        <div>⏳ Загрузка...</div>
      ) : (
        <>
          <div className="alert alert-secondary">
            <strong>Уровень:</strong>{' '}
            {policyDescriptions[currentLevel] || `Неизвестный (${currentLevel})`}
          </div>
          {status && <div className="alert alert-info">{status}</div>}
        </>
      )}
    </div>
  );
}

export default EmailNotificationInfo;

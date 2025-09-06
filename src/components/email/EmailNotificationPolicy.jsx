import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const policyOptions = [
  {
    value: 'NEW_TICKET',
    label: 'Не оповещать о новых заявках',
  },
  {
    value: 'NEW_MESSAGE',
    label: 'Не оповещать о сообщениях',
  },
  {
    value: 'NEW_SYSTEM_MESSAGE',
    label: 'Не оповещать о системных событиях',
  },
  {
    value: 'NEW_TICKET_OR_MESSAGE',
    label: 'Не оповещать о новых заявках и сообщениях',
  },
  {
    value: 'NONE',
    label: 'Получать все оповещения',
  },
];

function EmailNotificationPolicy() {
  const [selectedPolicy, setSelectedPolicy] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    if (!selectedPolicy) {
      setStatus('⚠️ Пожалуйста, выберите уровень перед сохранением');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/v1/email/notify-set?level=${selectedPolicy}`);
      if (res.data === 'Успешно') {
        setStatus('✅ Настройки успешно применены');
      } else {
        setStatus('⚠️ Неожиданный ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при отправке политики уведомлений:', err);
      setStatus(
          <>
            ⛔ Ошибка при сохранении настроек. Возможно, ваша сессия устарела, просто <a href="/login">повторите авторизацию</a>.
          </>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4>Настройка email-уведомлений</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="policySelect" className="form-label">Уровень оповещения:</label>
          <select
            id="policySelect"
            className="form-select"
            value={selectedPolicy}
            onChange={(e) => setSelectedPolicy(e.target.value)}
          >
            <option value="" disabled>
              — Выберите уровень —
            </option>
            {policyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Сохраняем...' : 'Сохранить настройки'}
        </button>
      </form>

      {status && <div className="mt-3 alert alert-info">{status}</div>}
    </div>
  );
}

export default EmailNotificationPolicy;

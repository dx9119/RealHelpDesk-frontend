import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function TicketMessageForm({ portalId, ticketId }) {
  const [messageText, setMessageText] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!messageText.trim()) {
      setStatusMessage('⚠️ Введите текст сообщения');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(`/api/v1/message/${portalId}/${ticketId}`, {
        messageText: messageText.trim(),
      });

      setStatusMessage(res.data.message || '✅ Сообщение успешно отправлено');

      // Обнуляем поле
      setMessageText('');

      // Немного подождём и перезагрузим страницу
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('⛔ Ошибка:', err);
      setStatusMessage('❌ Ошибка при отправке сообщения (HTML/JS/SQL внутри сообщения запрещен)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-body">
        <h5 className="card-title text-primary mb-3">📨 Новое сообщение по заявке №{ticketId}</h5>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <textarea
              className="form-control"
              rows="4"
              placeholder="Введите текст сообщения..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Отправка...' : 'Отправить сообщение'}
          </button>
        </form>

        {statusMessage && (
          <div className="mt-3 alert alert-info">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketMessageForm;

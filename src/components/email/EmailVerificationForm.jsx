import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function EmailVerificationForm() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirmEmail = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setStatus('⚠️ Введите код подтверждения');
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.get(`/api/v1/email/confirm?token=${code.trim()}`);
      if (res.data === 'Успешно') {
        setStatus('✅ Email успешно подтверждён');
      } else {
        setStatus(`❌ Ответ сервера: ${res.data}`);
      }
    } catch (err) {
      console.error('Ошибка при подтверждении email:', err);
      setStatus('⛔ Не удалось подтвердить email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <h4>Подтверждение email</h4>
      <form onSubmit={handleConfirmEmail}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Введите код из письма"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <button className="btn btn-success" type="submit" disabled={loading}>
          {loading ? 'Отправка...' : 'Подтвердить'}
        </button>
      </form>

      {status && <div className="mt-3 alert alert-info">{status}</div>}
    </div>
  );
}

export default EmailVerificationForm;

import { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function AddPortalUsers({ portalId }) {
  const [uuidInput, setUuidInput] = useState('');
  const [responseMsg, setResponseMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const parseUUIDs = (input) => {
    return input
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length === 36);
  };

  const handleSubmit = async () => {
    const uuids = parseUUIDs(uuidInput);

    if (uuids.length === 0) {
      setResponseMsg('❗ Введите хотя бы один корректный UUID');
      return;
    }

    setLoading(true);
    setResponseMsg('');

    try {
      const res = await axiosInstance.post(
          `/api/v1/portals/shared/${portalId}/users`,
          { newAccessUserId: uuids }
      );

      if (res.data === 'Успешно') {
        setResponseMsg('✅ Пользователи успешно добавлены');
      } else {
        setResponseMsg(`⚠️ Ответ: ${JSON.stringify(res.data)}`);
      }
    } catch (err) {
        console.error('⛔ Ошибка запроса:', err);

        const serverError = err.response?.data;

        setResponseMsg(
            typeof serverError === 'string'
                ? `❌ ${serverError}`
                : `❌ ${JSON.stringify(serverError, null, 2)}`
        );
    }
    finally {
      setLoading(false);
    }
  };

  return (
      <div className="mt-4">
        <h4>Добавление пользователей к порталу</h4>
        <label htmlFor="uuidList" className="form-label">
          Введите UUID через запятую:
        </label>
        <textarea
            id="uuidList"
            rows="3"
            className="form-control mb-3"
            value={uuidInput}
            onChange={(e) => setUuidInput(e.target.value)}
            placeholder="51c3..., 60de..., ..."
        />

        <button
            className="btn btn-success"
            onClick={handleSubmit}
            disabled={loading}
        >
          {loading ? 'Отправка...' : 'Добавить пользователей'}
        </button>

        {responseMsg && (
            <div className="alert alert-info mt-3">
              {responseMsg}
            </div>
        )}
      </div>
  );
}

export default AddPortalUsers;

import { useState, useEffect } from 'react';
import axiosInstance from '../../services/axiosInstance';

function DeletePortals({ initialIds = [] }) {
  const [ids, setIds] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [deletedIds, setDeletedIds] = useState([]);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  // 👇 Если initialIds меняются — обновляем поле ввода
  useEffect(() => {
    if (initialIds.length > 0) {
      setIds(initialIds.join(','));
    }
  }, [initialIds]);

  const handleInitialClick = () => {
    setConfirming(true);
    setStatus('');
    setError('');
    setDeletedIds([]);
  };

  const handleConfirmDelete = async () => {
    const idArray = ids
        .split(',')
        .map(id => id.trim())
        .filter(id => id.length > 0);

    if (idArray.length === 0) {
      setError('⚠️ Укажите хотя бы один ID');
      return;
    }

    const query = idArray.map(id => `id=${encodeURIComponent(id)}`).join('&');
    const url = `/api/v1/portals/delete?${query}`;

    try {
      const res = await axiosInstance.delete(url);
      const { count, deletedIds: serverDeletedIds } = res.data;

      if (count > 0 && Array.isArray(serverDeletedIds)) {
        setStatus(`✅ Удалено ${count} портал(ов)`);
        setDeletedIds(serverDeletedIds);
        setIds('');
        setConfirming(false);
        setError('');
      } else {
        const fallbackMessage =
            'Выбранные порталы не были удалены — скорее всего, вы не их владелец.';


        setError(typeof res.data === 'string'
            ? res.data
            : JSON.stringify(res.data.count === 0 ? fallbackMessage : res.data, null, 2));
      }
    } catch (err) {
      console.error('⛔ Ошибка удаления:', err);
      const serverError = err.response?.data;
      setError(typeof serverError === 'string'
          ? serverError
          : JSON.stringify(serverError, null, 2));
    }
  };

  return (
      <div className="mt-4">
        <h4>Удаление порталов</h4>

        <div className="mb-3">
          <label className="form-label">ID порталов (через запятую)</label>
          <input
              type="text"
              className="form-control"
              value={ids}
              onChange={e => setIds(e.target.value)}
              placeholder="Например: 1,2,3"
          />
        </div>

        {!confirming ? (
            <button className="btn btn-danger" onClick={handleInitialClick}>
              Удалить порталы
            </button>
        ) : (
            <>
              <div className="alert alert-warning">Вы уверены? Это действие необратимо!</div>
              <button className="btn btn-outline-danger me-2" onClick={handleConfirmDelete}>
                Подтвердить удаление
              </button>
              <button className="btn btn-secondary" onClick={() => setConfirming(false)}>
                Отмена
              </button>
            </>
        )}

        {status && (
            <div className="alert alert-success mt-3">
              {status}
              {deletedIds.length > 0 && (
                  <p className="mb-0">Удалены ID: <strong>{deletedIds.join(', ')}</strong></p>
              )}
            </div>
        )}

        {error && (
            <pre className="alert alert-danger mt-3 mb-0">{error}</pre>
        )}
      </div>
  );
}

export default DeletePortals;

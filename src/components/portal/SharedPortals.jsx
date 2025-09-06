import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function SharedPortals() {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;
  const sortBy = 'createdAt';
  const order = 'desc';

  useEffect(() => {
    const fetchSharedPortals = async () => {
      console.log(`📡 Запрос shared-порталов: page=${page}`);

      setLoading(true);
      try {
        const res = await axiosInstance.get('/api/v1/portals/shared', {
          params: {
            page,
            size: pageSize,
            sortBy,
            order,
          },
        });

        console.log('✅ Ответ:', res.data);
        setPortals(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setError('');
      } catch (err) {
        console.error('⛔ Ошибка загрузки shared-порталов:', err);
        setError('Ошибка при загрузке доступа к порталам');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPortals();
  }, [page]);

  const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));

  return (
    <div className="mt-4">
      <h3>Порталы, к которым у вас есть доступ</h3>

      <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
        <strong>🔧 Debug info:</strong><br />
        loading: {loading.toString()}<br />
        error: {error}<br />
        currentPage: {page}<br />
        totalPages: {totalPages}<br />
        portalsCount: {portals.length}
      </div>

      {loading && <p>Загрузка данных...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && portals.length === 0 && (
        <div className="alert alert-warning">У вас пока нет полученного доступа к порталам.</div>
      )}

      {!loading && portals.length > 0 && (
        <ul className="list-group mb-3">
          {portals.map(({ id, name, description, createdAt }) => (
            <li key={id} className="list-group-item">
              <h5>{name}</h5>
              <p className="mb-0">ID: {id}</p>
              <small className="text-muted">Описание: {description || '—'}</small><br />
              <small className="text-muted">Создан: {new Date(createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-between">
          <button
            className="btn btn-outline-primary"
            onClick={handlePrev}
            disabled={page === 0}
          >
            ⬅ Назад
          </button>
          <span>Страница {page + 1} из {totalPages}</span>
          <button
            className="btn btn-outline-primary"
            onClick={handleNext}
            disabled={page + 1 >= totalPages}
          >
            Вперёд ➡
          </button>
        </div>
      )}
    </div>
  );
}

export default SharedPortals;

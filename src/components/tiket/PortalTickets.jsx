import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { FaUser, FaTasks, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';

function PortalTickets({ portalId }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;
  const sortBy = 'createdAt';
  const order = 'desc';

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/api/v1/portals/${portalId}/ticket`, {
          params: { page, size: pageSize, sortBy, order },
        });

        setTickets(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setError('');
      } catch (err) {
        setError('Ошибка при загрузке заявок');
        console.error('⛔ Ошибка:', err);
      } finally {
        setLoading(false);
      }
    };

    if (portalId) fetchTickets();
  }, [portalId, page]);

  const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));

  return (
    <div className="mt-4 text-start">
      <h3 className="mb-4 text-primary">📄 Заявки портала №{portalId}</h3>

      {loading && (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && tickets.length === 0 && (
        <div className="alert alert-warning">🔍 Заявок не найдено.</div>
      )}

      {!loading && tickets.length > 0 && (
        <div className="row">
          {tickets.map(({
            id, title, authorFullName, assignedUserFullName, ticketPriority,
            ticketStatus, createdAt
          }) => (
            <div key={id} className="col-md-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-secondary">
                    #{id} — {title}
                  </h5>
                  <p className="card-text">
                    <FaUser className="me-2" />Автор: {authorFullName}
                  </p>
                  <p className="card-text">
                    <FaTasks className="me-2" />Ответственный: {assignedUserFullName}
                  </p>
                  <p className="card-text">
                    <FaExclamationTriangle className="me-2 text-warning" />Приоритет: <strong>{ticketPriority}</strong>
                  </p>
                  <p className="card-text">
                    <FaCheckCircle className="me-2 text-success" />Статус: <strong>{ticketStatus}</strong>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Создано: {new Date(createdAt).toLocaleString()}</small>
                  </p>
                   <a
                     href={`/ticket-show/portal/${portalId}/ticket/${id}`}
                     className="btn btn-sm btn-outline-primary mt-2"
                   >
                     Открыть заявку
                   </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && totalPages > 1 && (
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button className="btn btn-outline-secondary" onClick={handlePrev} disabled={page === 0}>
            ⬅ Назад
          </button>
          <span>Страница <strong>{page + 1}</strong> из <strong>{totalPages}</strong></span>
          <button
            className="btn btn-outline-secondary"
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

export default PortalTickets;

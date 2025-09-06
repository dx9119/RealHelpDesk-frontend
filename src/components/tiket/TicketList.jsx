import { useEffect, useState, useMemo } from 'react';
import { FaUser, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import axiosInstance from '../../services/axiosInstance';

// 🟢 Приоритет: перевод и цвет
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

// 🔵 Статус: перевод и цвет
const getStatusInfo = (status) => {
  switch (status) {
    case 'OPEN': return { label: 'Открыта', color: 'green' };
    case 'IN_PROGRESS': return { label: 'В процессе', color: 'orange' };
    case 'CLOSED': return { label: 'Закрыта', color: 'gray' };
    default: return { label: 'Неизвестно', color: 'black' };
  }
};

function TicketList({ title, endpoint, extraParams = {}, getLink }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;
  const sortBy = 'createdAt';
  const order = 'desc';

  const memoizedParams = useMemo(() => extraParams, [JSON.stringify(extraParams)]);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(endpoint, {
          params: {
            page,
            size: pageSize,
            sortBy,
            order,
            ...memoizedParams,
          },
        });

        setTickets(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setError('');
      } catch (err) {
        setError('Ошибка при загрузке заявок');
        console.error('⛔ Ошибка:', err);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [endpoint, page, memoizedParams]);

  const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));

  return (
      <div className="mt-4 text-start">
        <h3 className="mb-4 text-primary">{title}</h3>

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
                              ticketStatus, createdAt, portalId
                            }) => (
                  <div key={id} className="col-md-6 mb-4">
                    <div className="card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="card-title text-secondary">
                          #{id} — {title}
                        </h5>

                        {authorFullName && (
                            <p className="card-text">
                              <FaUser className="me-2" />
                              Автор: {authorFullName}
                            </p>
                        )}

                        <p className="card-text">
                          <FaExclamationTriangle className="me-2 text-warning" />
                          Приоритет:{' '}
                          <span style={{
                            backgroundColor: getPriorityInfo(ticketPriority).color,
                            color: 'white',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '5px',
                            fontWeight: 'bold'
                          }}>
                      {getPriorityInfo(ticketPriority).label}
                    </span>
                        </p>

                        <p className="card-text">
                          <FaCheckCircle className="me-2 text-success" />
                          Статус:{' '}
                          <span style={{
                            backgroundColor: getStatusInfo(ticketStatus).color,
                            color: 'white',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '5px',
                            fontWeight: 'bold'
                          }}>
                      {getStatusInfo(ticketStatus).label}
                    </span>
                        </p>

                        <p className="card-text">
                          <small className="text-muted">Создано: {new Date(createdAt).toLocaleString()}</small>
                        </p>

                        <a
                            href={getLink({ id, portalId })}
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
              <button
                  className="btn btn-outline-secondary"
                  onClick={handlePrev}
                  disabled={page === 0}
              >
                ⬅ Назад
              </button>
              <span>
            Страница <strong>{page + 1}</strong> из <strong>{totalPages}</strong>
          </span>
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

export default TicketList;

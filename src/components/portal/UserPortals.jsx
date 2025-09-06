import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import TicketIdListByType from "../tiket/TicketIdListByType";

function UserPortals({ onViewRequests, onDeletePortal, onEditPortal }) {
  const [portals, setPortals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewType, setViewType] = useState('own');
  const [expandedId, setExpandedId] = useState(null); // 👈 для раскрытия

  const pageSize = 10;
  const sortBy = 'createdAt';
  const order = 'desc';

  useEffect(() => {
    const fetchPortals = async () => {
      setLoading(true);
      try {
        const url = viewType === 'own' ? '/api/v1/portals' : '/api/v1/portals/shared';
        const res = await axiosInstance.get(url, {
          params: { page, size: pageSize, sortBy, order },
        });

        setPortals(res.data.content || []);
        setTotalPages(res.data.totalPages || 1);
        setError('');
      } catch (err) {
        setError(
            <>
              ❌ Не удалось выполнить. Возможно, ваша сессия устарела. Просто <a href="/login">выполните авторизацию повторно</a>.
            </>
        );
        setPortals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPortals();
  }, [page, viewType]);

  const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
  const handleNext = () => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));

  return (
      <div className="mt-4">
        <h3 className="mb-3">📂 Порталы</h3>

        <div className="btn-group mb-4">
          <button
              className={`btn ${viewType === 'own' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setViewType('own'); setPage(0); }}
          >
            🧍 Мои порталы
          </button>
          <button
              className={`btn ${viewType === 'shared' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => { setViewType('shared'); setPage(0); }}
          >
            👥 Общие порталы
          </button>
        </div>

        {loading && <div className="text-muted">Загружаем порталы...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && portals.length === 0 && (
            <div className="alert alert-warning">На этой странице нет порталов.</div>
        )}

        {!loading && portals.length > 0 && (
            <div className="row">
              {portals.map(({ id, name, description, createdAt }) => {
                const isExpanded = expandedId === id;
                const shortName = name.length > 40 ? name.slice(0, 40) + '...' : name;
                const shortDescription = description && description.length > 80 ? description.slice(0, 80) + '...' : description;

                return (
                    <div key={id} className="col-md-6 mb-4">
                      <div className="card shadow-sm h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                          <div>
                            <h5 className="card-title">{isExpanded ? name : shortName}</h5>
                            <p className="card-text mb-1"><strong>ID:</strong> {id}</p>
                            <p className="card-text mb-1">
                              <strong>Описание:</strong> {isExpanded ? (description || '—') : (shortDescription || '—')}
                            </p>
                            {(name.length > 40 || (description && description.length > 80)) && (
                                <button
                                    className="btn btn-link btn-sm px-0"
                                    onClick={() => setExpandedId(isExpanded ? null : id)}
                                >
                                  {isExpanded ? 'Скрыть' : 'Показать полностью'}
                                </button>
                            )}
                            <p className="card-text text-muted">
                              <small>Создан: {dayjs(createdAt).format('DD.MM.YYYY HH:mm')}</small>
                            </p>

                            <div className="container">
                              <div className="row g-3 mt-2">
                                <div className="col-md-6 col-lg-6">
                                  <section
                                      className="border rounded p-3 h-100"
                                      style={{ backgroundColor: '#fff5f5', minHeight: '220px' }}
                                  >
                                    <h6 className="text-primary mb-3">📭 Заявки без ответа</h6>
                                    <TicketIdListByType
                                        portalId={id}
                                        title=""
                                        endpoint={`/api/v1/portals/${id}/ticket/no-answer`}
                                    />
                                  </section>
                                </div>

                                <div className="col-md-6 col-lg-6">
                                  <section
                                      className="border rounded p-3 h-100"
                                      style={{ backgroundColor: '#f9f5ea', minHeight: '220px' }}
                                  >
                                    <h6 className="text-primary mb-3">🛠️ Заявки в работе</h6>
                                    <TicketIdListByType
                                        portalId={id}
                                        title=""
                                        endpoint={`/api/v1/portals/${id}/ticket/status/IN_PROGRESS`}
                                    />
                                  </section>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="btn-group mt-3" role="group">
                            <button className="btn btn-outline-info btn-sm" onClick={() => onViewRequests(id)}>Все заявки</button>
                            <Link to={`/ticket/create?portalId=${id}`} className="btn btn-outline-success btn-sm">Создать заявку</Link>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => onEditPortal(id)}>Настройки</button>
                            <button className="btn btn-outline-danger btn-sm" onClick={() => onDeletePortal(id)}>Удалить</button>
                          </div>
                        </div>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        {!loading && totalPages > 1 && (
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-outline-primary" onClick={handlePrev} disabled={page === 0}>
                ⬅ Назад
              </button>
              <span className="text-muted">
            Страница <strong>{page + 1}</strong> из <strong>{totalPages}</strong>
          </span>
              <button className="btn btn-outline-primary" onClick={handleNext} disabled={page + 1 >= totalPages}>
                Вперёд ➡
              </button>
            </div>
        )}
      </div>
  );
}

export default UserPortals;

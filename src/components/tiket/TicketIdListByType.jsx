import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

function TicketIdListByType({ portalId, title, endpoint }) {
    const [ticketIds, setTicketIds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);

    const pageSize = 10;
    const totalPages = Math.ceil(ticketIds.length / pageSize);

    useEffect(() => {
        const fetchTickets = async () => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(endpoint);

                if (Array.isArray(res.data)) {
                    setTicketIds(res.data);
                    setError('');
                } else {
                    throw new Error(res.data.message || 'Неизвестная ошибка');
                }
            } catch (err) {
                setError(err.message || 'Ошибка при получении заявок');
                setTicketIds([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [portalId, endpoint]);

    const currentTickets = ticketIds.slice(page * pageSize, (page + 1) * pageSize);

    const handlePrev = () => setPage(prev => Math.max(prev - 1, 0));
    const handleNext = () => setPage(prev => (prev + 1 < totalPages ? prev + 1 : prev));

    return (
        <div className="mt-3">
            <h6 className="mb-2">{title}</h6>
            {loading && <p>⏳ Загрузка...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && ticketIds.length > 0 && (
                <>
                    <ul className="list-group mb-2">
                        {currentTickets.map(id => (
                            <li key={id} className="list-group-item py-1 px-2">
                                <Link to={`/ticket-show/portal/${portalId}/ticket/${id}`}>
                                    Заявка №{id}
                                </Link>
                            </li>
                        ))}
                    </ul>
                    {totalPages > 1 && (
                        <div className="d-flex justify-content-between align-items-center">
                            <button className="btn btn-sm btn-outline-primary" onClick={handlePrev} disabled={page === 0}>
                                ⬅
                            </button>
                            <span className="small text-muted">Стр. {page + 1} из {totalPages}</span>
                            <button className="btn btn-sm btn-outline-primary" onClick={handleNext} disabled={page + 1 >= totalPages}>
                                ➡
                            </button>
                        </div>
                    )}
                </>
            )}

            {!loading && ticketIds.length === 0 && !error && (
                <p className="text-muted">Нет заявок.</p>
            )}
        </div>
    );
}

export default TicketIdListByType;

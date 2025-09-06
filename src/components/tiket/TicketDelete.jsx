import React, { useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

function TicketDelete({ portalId, ticketId: initialTicketId }) {
    const [ticketId, setTicketId] = useState(initialTicketId || '');
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleDelete = async () => {
        if (!confirmDelete || !ticketId) {
            setMessage('⚠️ Подтвердите удаление и введите ID заявки');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await axiosInstance.delete(
                `/api/v1/portals/${portalId}/ticket/delete/${ticketId}`
            );

            if (response.data === 'Успех') {
                setMessage('✅ Заявка успешно удалена');
            } else {
                setMessage('⚠️ Не удалось удалить заявку');
            }
        } catch (err) {
            const data = err.response?.data;
            const msg =
                data?.Сообщение ||
                data?.message ||
                '❌ Ошибка при удалении заявки';
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card my-4 shadow-sm">
            <div className="card-body">
                <h5
                    className="card-title text-danger"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setExpanded(!expanded)}
                >
                    🗑️ Удалить заявку {expanded ? '▲' : '▼'}
                </h5>

                {expanded && (
                    <>
                        <div className="alert alert-warning">
                            <strong>⚠️ Внимание:</strong> удаление заявок не рекомендуется. Вы можете просто <strong>закрыть заявку</strong>, чтобы сохранить историю.
                        </div>

                        <div className="mb-3">
                            <label htmlFor="ticketIdInput" className="form-label">
                                ID заявки для удаления:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="ticketIdInput"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                placeholder="Введите ID заявки"
                            />
                        </div>

                        <div className="form-check mb-3">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="confirmDeleteCheck"
                                checked={confirmDelete}
                                onChange={() => setConfirmDelete(!confirmDelete)}
                            />
                            <label className="form-check-label" htmlFor="confirmDeleteCheck">
                                Я подтверждаю удаление заявки
                            </label>
                        </div>

                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            {loading ? 'Удаление...' : 'Удалить заявку'}
                        </button>

                        {message && <div className="alert alert-info mt-3">{message}</div>}
                    </>
                )}
            </div>
        </div>
    );
}

export default TicketDelete;

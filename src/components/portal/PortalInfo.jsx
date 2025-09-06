import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

function PortalInfo() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const portalId = searchParams.get('portalId');

    const [portal, setPortal] = useState(null);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(false); // 👈 состояние раскрытия

    useEffect(() => {
        if (!portalId) {
            setError('❌ Не указан ID портала.');
            return;
        }

        const fetchPortalInfo = async () => {
            try {
                const res = await axiosInstance.get(`/api/v1/portals/info/${portalId}`);
                if (res.data?.id) {
                    setPortal(res.data);
                } else {
                    setError(res.data?.message || 'Портал не найден');
                }
            } catch (err) {
                if (err.response) {
                    setError(err.response.data?.message || `Ошибка ${err.response.status}`);
                } else {
                    console.error('Неизвестная ошибка:', err);
                    setError(
                        <>
                            Ошибка при получении данных. Возможно, ваша сессия устарела. Просто <a href="/login">авторизуйтесь повторно</a>.
                        </>
                    );
                }
            }
        };

        fetchPortalInfo();
    }, [portalId]);

    const shortName = portal?.namePortal?.length > 40 ? portal.namePortal.slice(0, 40) + '...' : portal?.namePortal;
    const shortDescription = portal?.description?.length > 80 ? portal.description.slice(0, 80) + '...' : portal?.description;

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Информация о портале</h3>

            {error && (
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="alert alert-secondary">{error}</div>
                    </div>
                </div>
            )}

            {portal && (
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card border-0 shadow-sm">
                            <div className="card-body">
                                <h5>
                                    Название портала: {expanded ? portal.namePortal : shortName}
                                </h5>
                                <p><strong>Номер портала:</strong> {portal.id}</p>
                                <p>
                                    <strong>Описание:</strong> {expanded ? portal.description : shortDescription || '—'}
                                </p>
                                {(portal.namePortal?.length > 40 || portal.description?.length > 80) && (
                                    <button
                                        className="btn btn-link btn-sm px-0"
                                        onClick={() => setExpanded(prev => !prev)}
                                    >
                                        {expanded ? 'Скрыть' : 'Показать полностью'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PortalInfo;

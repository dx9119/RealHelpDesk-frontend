import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const PortalEditor = ({ portalId }) => {
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');

    useEffect(() => {
        const fetchPortalData = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/portals/info/${portalId}`);
                setFormData({
                    name: response.data.namePortal || '',
                    description: response.data.description || ''
                });
            } catch {
                setStatusMessage('❌ Не удалось загрузить данные портала.');
            }
        };

        const fetchPortalStatus = async () => {
            try {
                const response = await axiosInstance.get(`/api/v1/portals/shared/${portalId}/status`);
                setIsPublic(response.data);
            } catch {
                setStatusMessage('⚠️ Не удалось загрузить статус публичности.');
            }
        };

        fetchPortalData();
        fetchPortalStatus();
    }, [portalId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.name.trim()) {
            errors.push('Название портала не может быть пустым.');
        } else if (formData.name.length > 255) {
            errors.push('Название портала не может превышать 255 символов.');
        }

        if (formData.description.length > 2500) {
            errors.push('Описание не может превышать 2500 символов.');
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage('');

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setStatusMessage(validationErrors.map((err, i) => <div key={i}>❌ {err}</div>));
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post(
                `/api/v1/portals/info/update/${portalId}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setFormData({
                name: response.data.namePortal,
                description: response.data.description
            });
            setStatusMessage('✅ Портал успешно обновлён.');
        } catch {
            setStatusMessage('❌ Ошибка при обновлении портала.');
        } finally {
            setLoading(false);
        }
    };

    const togglePortalStatus = async () => {
        try {
            await axiosInstance.post(`/api/v1/portals/shared/${portalId}/status?isPublic=${!isPublic}`);
            setIsPublic(!isPublic);
            setStatusMessage(`📢 Статус портала обновлён: теперь он ${!isPublic ? 'публичный' : 'приватный'}.`);
        } catch {
            setStatusMessage('❌ Ошибка при обновлении статуса публичности.');
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Редактирование портала</h2>

            {/* 🔄 Блок переключателя публичности */}
            <div className="card mb-4 p-3 border">
                <h5>Статус доступа к порталу</h5>
                <div className="form-check form-switch mt-2">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="publicSwitch"
                        checked={isPublic}
                        onChange={togglePortalStatus}
                    />
                    <label className="form-check-label" htmlFor="publicSwitch">
                        {isPublic ? 'Портал публичный' : 'Портал приватный'}
                    </label>
                </div>
                <small className="text-muted d-block mt-2">
                    💡 Изменение статуса применяется автоматически. Публичный статус портала дает возможность любому пользователю создавать в его рамках заявки.
                </small>
            </div>

            {/* 📋 Основная форма */}
            <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Название портала</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Введите название"
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Описание</label>
                    <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Введите описание"
                        rows="4"
                    />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Сохраняем...' : 'Сохранить изменения'}
                </button>

                {statusMessage && <div className="mt-3 alert alert-info">{statusMessage}</div>}
            </form>
        </div>
    );
};

export default PortalEditor;

import { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import { useSearchParams } from 'react-router-dom';

function PortalSettings() {
  const [searchParams] = useSearchParams();
  const portalId = searchParams.get("id");
  const [sharedConfig, setSharedConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [Успешно, setУспешно] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      console.log(`🔄 Получаем настройки для портала: ${portalId}`);

      try {
        const res = await axiosInstance.get(`/api/v1/portals/shared/${portalId}`);
        console.log('✅ Ответ от сервера:', res);
        setSharedConfig(res.data || {});
        setError('');
      } catch (err) {
        console.error('⛔ Ошибка получения настроек:', err);

        const status = err.response?.status;
        const message = err.response?.data?.message;

        console.log('🧪 Код ошибки при загрузке:', status);
        console.log('🧪 Сообщение ошибки при загрузке:', message);

        const limitMessage = 'The limit on the number of allowed portal users has been reached';

        if (status === 418 || message === limitMessage) {
          setError(
              '❌ Достигнут лимит по количеству внешних пользователей портала. Для расширения лимитов обратитесь к администратору.'
          );
        } else {
          setError('❌ Не удалось загрузить настройки портала');
        }

        setSharedConfig(null);
      } finally {
        console.log('📍 Завершили загрузку');
        setLoading(false);
      }
    };

    if (portalId) fetchSettings();
  }, [portalId]);

  const handleSave = async () => {
    console.log('📤 Отправляем данные для сохранения...');

    try {
      const payload = { users: sharedConfig.users }; // Передаём весь список пользователей
      const res = await axiosInstance.post(`/api/v1/portals/shared/${portalId}/users`, payload);

      console.log('✅ Сохранение прошло успешно:', res);
      setУспешно('✅ Настройки успешно сохранены');
      setError('');
    } catch (err) {
      console.error('⛔ Ошибка при сохранении:', err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      console.log('🧪 Код ошибки при сохранении:', status);
      console.log('🧪 Сообщение ошибки при сохранении:', message);

      const limitMessage = 'The limit on the number of allowed portal users has been reached';

      if (status === 418 || message === limitMessage) {
        setError(
            '❌ Достигнут лимит по количеству внешних пользователей портала. Для расширения лимитов обратитесь к администратору.'
        );
      } else {
        setError('❌ Не удалось сохранить настройки. Попробуйте позже.');
      }

      setУспешно('');
    }
  };

  return (
      <div className="mt-4">
        <h4>Текущие настройки:</h4>

        {loading && <p>⏳ Загружаем настройки...</p>}

        {error && (
            <div className="alert alert-danger">
              {error}
            </div>
        )}

        {Успешно && (
            <div className="alert alert-success">
              {Успешно}
            </div>
        )}

        {!loading && sharedConfig && (
            <div className="card p-3">
              <p><strong>Общий доступ:</strong> {sharedConfig.public ? 'Да' : 'Нет'}</p>

              <p><strong>Пользователи, имеющие доступ:</strong></p>
              {sharedConfig.users?.length > 0 ? (
                  <ul className="list-group">
                    {sharedConfig.users.map((user, index) => (
                        <li key={index} className="list-group-item">
                          <div><strong>ID:</strong> {user.id}</div>
                          <div><strong>Имя:</strong> {user.firstName} {user.middleName ? `${user.middleName} ` : ''}{user.lastName}</div>
                          <div><strong>Email:</strong> {user.email}</div>
                        </li>
                    ))}
                  </ul>
              ) : (
                  <div className="alert alert-info">
                    Нет добавленных пользователей.
                  </div>
              )}
            </div>
        )}

        {!loading && sharedConfig && (
            <button className="btn btn-primary mt-3" onClick={handleSave}>
              Сохранить настройки
            </button>
        )}
      </div>
  );
}

export default PortalSettings;

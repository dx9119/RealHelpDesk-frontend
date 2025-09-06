import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';

const ID_REGEX = /^[0-9a-fA-F\-]{36}$/;
const ITEMS_PER_PAGE = 10;

function CopyButton({ textToCopy }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <button
            className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-primary'}`}
            onClick={handleCopy}
            title="Скопировать ID"
        >
            {copied ? '✅ Скопировано' : '📋 Копировать ID'}
        </button>
    );
}

function UnifiedPortalUserEditor({ portalId }) {
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [loadedUsers, setLoadedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [responseMsg, setResponseMsg] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [invalidIDs, setInvalidIDs] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    // Единая функция GET с cache-busting и no-cache
    const getUsers = useCallback(async () => {
        const url = `/api/v1/portals/shared/${portalId}`;
        const res = await axiosInstance.get(url, {
            params: { _: Date.now() },
            headers: {
                'Cache-Control': 'no-cache',
                Pragma: 'no-cache',
            },
        });
        return res.data?.users || [];
    }, [portalId]);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const currentUsers = await getUsers();
            setLoadedUsers(currentUsers);
            setTags(currentUsers.map(u => u.id));
        } catch (err) {
            console.error('Ошибка загрузки:', err);
            setResponseMsg('❌ Не удалось загрузить список пользователей');
        } finally {
            setLoading(false);
        }
    }, [getUsers]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = loadedUsers.filter(user =>
        `${user.lastName} ${user.firstName} ${user.middleName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
    const displayedUsers = filteredUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const addTag = () => {
        const raw = tagInput.trim();
        if (!raw) return;

        const splitIds = raw.split(',').map(id => id.trim()).filter(Boolean);
        const newValid = splitIds.filter(id => ID_REGEX.test(id) && !tags.includes(id));
        const newInvalid = splitIds.filter(id => !ID_REGEX.test(id) && !invalidIDs.includes(id));

        setTags(prev => [...prev, ...newValid]);
        setInvalidIDs(prev => [...prev, ...newInvalid]);
        setTagInput('');
    };

    const removeTag = (id) => {
        setTags(prev => prev.filter(tag => tag !== id));
        setInvalidIDs(prev => prev.filter(tag => tag !== id));
    };

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    // Поллинг до появления обновлённого списка на бэке (макс 10 секунд)
    const pollUntilUpdated = useCallback(async (expectedIds, timeoutMs = 10000, intervalMs = 800) => {
        const expected = [...expectedIds].sort();
        const deadline = Date.now() + timeoutMs;

        while (Date.now() < deadline) {
            try {
                const users = await getUsers();
                const ids = users.map(u => u.id).sort();
                if (ids.length === expected.length && ids.every((v, i) => v === expected[i])) {
                    setLoadedUsers(users);
                    setTags(ids);
                    return true;
                }
            } catch (_) {
                // игнорируем и пробуем снова
            }
            await sleep(intervalMs);
        }
        return false;
    }, [getUsers]);

    const handleSubmit = async () => {
        setSubmitting(true);
        setResponseMsg('⏳ Отправка данных...');
        try {
            const res = await axiosInstance.post(`/api/v1/portals/shared/${portalId}/users`, {
                newAccessUserId: tags
            });

            const success =
                res.data === 'Успешно' ||
                res.data?.message === 'Успешно' ||
                (typeof res.data === 'string' && res.data.toLowerCase().includes('успешно'));

            if (success) {
                setResponseMsg(tags.length > 0
                    ? '✅ Доступ успешно обновлён'
                    : '✅ Все внешние пользователи удалены'
                );

                // даём бэку «дописать» и ждём консистентности
                const updated = await pollUntilUpdated(tags);
                if (!updated) {
                    await fetchUsers(); // фоллбек
                }

                setInvalidIDs([]);
                setCurrentPage(1);

                // Если нужна именно «жёсткая» перезагрузка всего браузерного окна:
                // window.location.href = window.location.href;
            } else {
                setResponseMsg(`⚠️ Ответ сервера: ${JSON.stringify(res.data)}`);
            }
        } catch (err) {
            console.error('Ошибка:', err);
            setResponseMsg('❌ Ошибка отправки данных');
        } finally {
            setSubmitting(false);
            window.location.href = window.location.href;
        }
    };

    const copyAllIDs = () => {
        const allIDs = loadedUsers.map(user => user.id).join(', ');
        navigator.clipboard.writeText(allIDs);
        setResponseMsg('✅ Все ID скопированы в буфер');
    };

    return (
        <div className="mt-4">
            <h4>Пользователи портала</h4>

            <input
                type="text"
                className="form-control mb-2"
                placeholder="Поиск по ФИО, email, ID..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />

            {loading ? (
                <p>⏳ Загрузка...</p>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {displayedUsers.map(user => (
                            <li
                                key={user.id}
                                className="list-group-item d-flex justify-content-between align-items-start flex-column flex-md-row"
                            >
                                <div>
                                    <strong>👤</strong> {user.lastName} {user.firstName} {user.middleName || ''}<br />
                                    <strong>📧</strong> {user.email}<br />
                                    <strong>ID:</strong> <code>{user.id}</code>
                                </div>
                                <CopyButton textToCopy={user.id} />
                            </li>
                        ))}
                    </ul>

                    {totalPages > 1 && (
                        <nav>
                            <ul className="pagination">
                                {[...Array(totalPages).keys()].map(i => (
                                    <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </>
            )}

            <div className="my-4">
                <button className="btn btn-outline-secondary" onClick={copyAllIDs}>
                    📋 Скопировать все ID
                </button>
            </div>

            <label htmlFor="tagEditor" className="form-label">Редактировать доступ через список ID:</label>

            <div className="mb-3">
                <div className="d-flex flex-wrap gap-2">
                    {tags.map(id => {
                        const user = loadedUsers.find(u => u.id === id);
                        const label = user
                            ? `${id} (${user.lastName} ${user.firstName}${user.middleName ? ' ' + user.middleName : ''})`
                            : id;

                        return (
                            <span key={id} className={`badge bg-${invalidIDs.includes(id) ? 'danger' : 'primary'} p-2`}>
                {label}
                                <button
                                    className="btn-close btn-close-white btn-sm ms-1"
                                    onClick={() => removeTag(id)}
                                    title="Удалить"
                                />
              </span>
                        );
                    })}
                </div>

                <div className="input-group mt-2">
                    <input
                        id="tagEditor"
                        type="text"
                        className="form-control"
                        placeholder="Введите один или несколько ID через запятую"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addTag();
                            }
                        }}
                    />
                    <button className="btn btn-outline-success" onClick={addTag}>
                        ➕ Добавить ID
                    </button>
                </div>
            </div>

            {invalidIDs.length > 0 && (
                <div className="text-danger mb-2">
                    ⚠️ Некорректные ID: {invalidIDs.join(', ')}
                </div>
            )}

            <button className="btn btn-success" onClick={handleSubmit} disabled={submitting}>
                {submitting ? '💾 Сохраняю…' : '💾 Сохранить доступ'}
            </button>

            <small className="text-muted d-block mt-2">
                💡 После ввода ID, нажмите "Добавить ID", затем "Сохранить доступ".
            </small>

            {responseMsg && (
                <div className="alert alert-info mt-3">{responseMsg}</div>
            )}
        </div>
    );
}

export default UnifiedPortalUserEditor;

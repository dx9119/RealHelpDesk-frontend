import { useLocation } from 'react-router-dom';
import Footer from "../Footer";
import Header from "../Header";

function ForbiddenPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const parsedParams = {};
    const unparsedParams = {};

    for (const [key, value] of searchParams.entries()) {
        try {
            const decoded = decodeURIComponent(value);
            try {
                parsedParams[key] = JSON.parse(decoded);
            } catch {
                parsedParams[key] = decoded;
            }
        } catch {
            unparsedParams[key] = value;
        }
    }

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="text-warning">🚫 403: Доступ к странице ограничен</h2>
                <p>Ой! Похоже, доступ к этой странице закрыт.</p>
                <p>1. Это может быть связано с настройками доступа портала/заявки (настройки задает автор заявки/портала).</p>
                <p>2. Изменять настройки портала может только создатель портала.</p>
                <p>3. Изменить статус/приоритет заявки, удалить заявку - может только её создатель и пользователи портала.</p>

                <div className="mt-4">
                    <a href="/" className="btn btn-primary">
                        ⬅️ Перейти на главную
                    </a>
                </div>

                <div className="mt-4">
                    <h5>📋 Информация:</h5>
                    <ul className="list-group">
                        {Object.entries(parsedParams).map(([key, value]) => (
                            <li key={key} className="list-group-item">
                                <strong>{key}:</strong> {JSON.stringify(value)}
                            </li>
                        ))}
                    </ul>
                </div>

                {Object.keys(unparsedParams).length > 0 && (
                    <div className="mt-4">
                        <h5>🧩 Доп. информация:</h5>
                        <ul className="list-group">
                            {Object.entries(unparsedParams).map(([key, value]) => (
                                <li key={key} className="list-group-item">
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>
            <Footer />
        </>
    );
}

export default ForbiddenPage;

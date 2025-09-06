import { useLocation } from 'react-router-dom';
import Footer from "../Footer";
import Header from "../Header";

function LimitExceededPage() {
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
                <h2 className="text-warning">🥴 418: Превышение лимитов</h2>
                <p>
                    Вы превысили допустимые лимиты:
                    <br />
                    — максимум <strong>2 портала</strong> на одного пользователя<br />
                    — максимум <strong>2 дополнительных пользователя</strong> на каждый портал (не на совокупность порталов)
                </p>
                <p>
                    Похоже, вы пытаетесь создать или добавить больше, чем разрешено.
                    Чтобы изменить лимиты, свяжитесь с администратором.
                </p>

                <div className="mt-4">
                    <h5>📋 Отправленные параметры:</h5>
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
                        <h5>🧩 Необработанные параметры:</h5>
                        <ul className="list-group">
                            {Object.entries(unparsedParams).map(([key, value]) => (
                                <li key={key} className="list-group-item">
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-5 border-top pt-3">
                    <h5>📬 Связаться с администратором</h5>
                    <p>
                        Вы можете запросить расширенные лимиты — напишите нам.
                        Воспользуйтесь формой "Задать вопрос" или электронной почтой.
                    </p>
                    <p>
                        Вы также можете удалить лишние порталы и пользователей из общего доступа.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default LimitExceededPage;

import { useLocation } from 'react-router-dom';
import Footer from "../Footer";
import Header from "../Header";

function GenericErrorPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorData = JSON.parse(searchParams.get('error') || '{}');

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="text-muted">⚠️ Ошибка при выполнении запроса</h2>
                <p>
                    Произошла непредвиденная ошибка. Это может быть связано с проблемами соединения, неправильным запросом
                    или временной недоступностью сервера.
                </p>

                {Object.keys(errorData).length > 0 && (
                    <div className="mt-4">
                        <h5>📋 Технические детали:</h5>
                        <pre className="bg-light p-3 border rounded">
                            {JSON.stringify(errorData, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-5 border-top pt-3">
                    <h5>📬 Сообщить о проблеме</h5>
                    <p>
                        Если ошибка повторяется — пожалуйста, сообщите администратору.
                        Используйте форму "Задать вопрос" или напишите на почту.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default GenericErrorPage;

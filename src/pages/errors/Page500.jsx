import { useLocation } from 'react-router-dom';
import Footer from "../Footer";
import Header from "../Header";

function ServerErrorPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const errorData = JSON.parse(searchParams.get('error') || '{}');

    return (
        <>
            <Header />
            <div className="container mt-5">
                <h2 className="text-danger">💥 500: Внутренняя ошибка сервера</h2>
                <p>
                    Что-то пошло не так на стороне сервера. Мы уже работаем над устранением проблемы.
                    Возможно, запрос был некорректным или сервер временно перегружен.
                </p>

                {Object.keys(errorData).length > 0 && (
                    <div className="mt-4">
                        <h5>📋 Детали ошибки:</h5>
                        <pre className="bg-light p-3 border rounded">
                            {JSON.stringify(errorData, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="mt-5 border-top pt-3">
                    <h5>📬 Сообщить об ошибке</h5>
                    <p>
                        Если проблема повторяется — сообщите администратору.
                        Вы можете использовать форму "Задать вопрос" или написать на почту.
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ServerErrorPage;

import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import ru from "date-fns/locale/ru";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ru", ru);

function TicketSearchForm({
                              onSearch,
                              loading,
                              error,
                              accessError,
                              noResults,
                              isMyTickets,          // 🆕 получаем значение из родителя
                              setIsMyTickets        // 🆕 получаем setter
                          }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [startDateLocal, setStartDateLocal] = useState(null);
    const [endDateLocal, setEndDateLocal] = useState(null);
    const [ticketStatus, setTicketStatus] = useState("");
    const [ticketPriority, setTicketPriority] = useState("");

    useEffect(() => {
        const filters = JSON.parse(localStorage.getItem("ticketSearchFilters"));
        if (filters) {
            setSearchTerm(filters.searchTerm || "");
            setStartDateLocal(filters.startDate ? new Date(filters.startDate) : null);
            setEndDateLocal(filters.endDate ? new Date(filters.endDate) : null);
            setTicketStatus(filters.ticketStatus || "");
            setTicketPriority(filters.ticketPriority || "");
            setIsMyTickets(filters.isMyTickets || false); // 🆕 восстановление состояния чекбокса
        }
    }, [setIsMyTickets]);

    const handleSearch = async () => {
        const now = new Date();
        now.setSeconds(59, 999);
        const defaultStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const start = startDateLocal || defaultStart;
        let end = endDateLocal || now;
        if (endDateLocal) {
            end = new Date(endDateLocal);
            end.setSeconds(59, 999);
        }

        localStorage.setItem("ticketSearchFilters", JSON.stringify({
            searchTerm,
            startDate: startDateLocal ? startDateLocal.getTime() : null,
            endDate: endDateLocal ? endDateLocal.getTime() : null,
            ticketStatus,
            ticketPriority,
            isMyTickets // 🆕 сохраняем состояние чекбокса
        }));

        const params = {
            search: searchTerm || undefined,
            startDate: start.toISOString(),
            endDate: end.toISOString(),
            ticketStatus: ticketStatus || undefined,
            ticketPriority: ticketPriority || undefined,
            isMyTickets, // 🆕 передаём значение чекбокса
            page: 0,
            size: 20,
            sortBy: "createdAt",
            order: "desc"
        };

        onSearch({ params, searchTerm, startDate: startDateLocal, endDate: endDateLocal, ticketStatus, ticketPriority, isMyTickets });
    };

    return (
        <div className="card shadow-sm border-0 mt-4">
            <div className="card-header bg-secondary text-white">
                <strong>Поиск по заявкам</strong>
            </div>
            <div className="card-body">
                {accessError && (
                    <div className="alert alert-warning">
                        ⚠️ У вас нет доступа ни к одному порталу. Создайте новый портал или запросите доступ у другого пользователя.
                    </div>
                )}
                {noResults && (
                    <div className="alert alert-warning">
                        🔎 Заявки не найдены по заданным параметрам. Попробуйте изменить фильтры или период.
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label">🔍 Поиск по теме, описанию или автору</label>
                    <input
                        type="text"
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Введите ключевые слова или ФИО автора... (не более 50 символов)"
                        maxLength={50}
                    />
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">📆 С даты и времени</label>
                        <DatePicker
                            selected={startDateLocal}
                            onChange={(date) => setStartDateLocal(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Время"
                            locale="ru"
                            dateFormat="dd.MM.yyyy HH:mm"
                            placeholderText="Дата и время начала"
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">📆 По дату и времени</label>
                        <DatePicker
                            selected={endDateLocal}
                            onChange={(date) => setEndDateLocal(date)}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="Время"
                            locale="ru"
                            dateFormat="dd.MM.yyyy HH:mm"
                            placeholderText="Дата и время окончания"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label className="form-label">📌 Статус заявки</label>
                        <select
                            className="form-select"
                            value={ticketStatus}
                            onChange={(e) => setTicketStatus(e.target.value)}
                        >
                            <option value="">Все</option>
                            <option value="OPEN">Открыта</option>
                            <option value="IN_PROGRESS">В процессе</option>
                            <option value="CLOSED">Закрыта</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">🏷 Приоритет</label>
                        <select
                            className="form-select"
                            value={ticketPriority}
                            onChange={(e) => setTicketPriority(e.target.value)}
                        >
                            <option value="">Любой</option>
                            <option value="CRITICAL">Критический</option>
                            <option value="HIGH">Высокий</option>
                            <option value="MEDIUM">Средний</option>
                            <option value="LOW">Низкий</option>
                            <option value="NONE">Без приоритета</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="form-check d-flex align-items-center">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                id="myTicketsCheck"
                                checked={isMyTickets}
                                onChange={(e) => setIsMyTickets(e.target.checked)}
                            />
                            <label className="form-check-label mb-0" htmlFor="myTicketsCheck">
                                🧑‍💼 Поиск только по моим заявкам
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    className="btn btn-primary"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? "⏳ Поиск..." : "🔍 Выполнить поиск"}
                </button>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}

export default TicketSearchForm;

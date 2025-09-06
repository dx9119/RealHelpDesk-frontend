import React, { useState, useEffect } from "react";
import axiosInstance from "../../services/axiosInstance";
import { createGlobalStyle } from "styled-components";
import TicketSearchForm from "./TicketSearchForm";
import TicketSearchResults from "./TicketSearchResults";
import SearchHelp from "../help/SearchHelp";

const LightDatepickerStyle = createGlobalStyle`
    .react-datepicker {
        font-family: Arial, sans-serif;
        background-color: #fff;
        border: 1px solid #ccc;
        color: #333;
    }
    .react-datepicker__header {
        background-color: #f5f5f5;
        border-bottom: 1px solid #ddd;
    }
    .react-datepicker__day:hover,
    .react-datepicker__day--selected {
        background-color: #e6f3ff;
        border-radius: 50%;
    }
`;

function TicketList({ title, tickets, getLink, total }) {
    return (
        <div className="mt-4">
            <h5>{title} {total ? `(${total})` : ""}</h5>
            {(!tickets || tickets.length === 0) ? (
                <p>😕 Ничего не найдено.</p>
            ) : (
                <ul className="list-group">
                    {tickets.map((ticket) => (
                        <li key={ticket.id} className="list-group-item">
                            <a href={getLink(ticket)}>
                                <strong>{ticket.title}</strong>
                            </a>
                            <br />
                            <small>
                                👤 {ticket.authorFullName} | 🏢 {ticket.portalName}<br />
                                📅 {new Date(ticket.createdAt).toLocaleString("ru-RU")}
                            </small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function SearchTicketByPortals() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [accessError, setAccessError] = useState(false);
    const [results, setResults] = useState([]);
    const [total, setTotal] = useState(0);
    const [lastFetchedAt, setLastFetchedAt] = useState(null);
    const [isMyTickets, setIsMyTickets] = useState(false);
    const [initialFilters, setInitialFilters] = useState({});

    useEffect(() => {
        const filters = JSON.parse(localStorage.getItem("ticketSearchFilters"));
        const now = new Date();
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);

        const defaultStartDate = weekAgo.toISOString();
        const defaultEndDate = now.toISOString();

        const appliedFilters = {
            searchTerm: filters?.searchTerm || "",
            startDate: filters?.startDate || defaultStartDate,
            endDate: filters?.endDate || defaultEndDate,
            ticketStatus: filters?.ticketStatus || "",
            ticketPriority: filters?.ticketPriority || "",
            isMyTickets: filters?.isMyTickets || false,
            lastFetchedAt: filters?.lastFetchedAt || null
        };

        setIsMyTickets(appliedFilters.isMyTickets);
        setLastFetchedAt(appliedFilters.lastFetchedAt);
        setInitialFilters(appliedFilters);
    }, []);

    const handleSearch = async ({ params, searchTerm, startDate, endDate, ticketStatus, ticketPriority }) => {
        setLoading(true);
        setError("");
        setAccessError(false);
        setResults([]);

        try {
            const now = new Date();
            const weekAgo = new Date();
            weekAgo.setDate(now.getDate() - 7);

            const finalStartDate = startDate || weekAgo.toISOString();
            const finalEndDate = endDate || now.toISOString();

            const response = await axiosInstance.get("/api/v1/portals/ticket/search", {
                params: {
                    ...params,
                    search: searchTerm,
                    startDate: finalStartDate,
                    endDate: finalEndDate,
                    ticketStatus,
                    ticketPriority,
                    isMyTickets
                }
            });

            const { content, totalElements } = response.data;

            localStorage.setItem("ticketSearchFilters", JSON.stringify({
                searchTerm,
                startDate: finalStartDate,
                endDate: finalEndDate,
                ticketStatus,
                ticketPriority,
                isMyTickets,
                lastFetchedAt: now.toISOString()
            }));

            setResults(content || []);
            setTotal(totalElements || 0);
            setLastFetchedAt(now.toISOString());
        } catch (err) {
            console.error("Ошибка поиска заявок:", err);

            const apiMessage = err?.response?.data?.message;
            if (apiMessage === "You don't have access to any portals") {
                setAccessError(true);
                setResults([]);
                setTotal(0);
            } else {
                setError(
                    <>
                        ❌ Не удалось выполнить поиск. Возможно, ваша сессия устарела. Просто <a href="/login">авторизуйтесь повторно</a>.
                    </>
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <LightDatepickerStyle />

            <TicketSearchForm
                onSearch={handleSearch}
                loading={loading}
                error={error}
                lastFetchedAt={lastFetchedAt}
                accessError={accessError}
                isMyTickets={isMyTickets}
                setIsMyTickets={setIsMyTickets}
                highlightFilledFields={true}
                initialFilters={initialFilters}
            />

            <SearchHelp></SearchHelp>

            {!accessError && (
                <TicketSearchResults
                    results={results}
                    total={total}
                    lastFetchedAt={lastFetchedAt}
                    ticketList={TicketList}
                />
            )}
        </>
    );
}

export default SearchTicketByPortals;

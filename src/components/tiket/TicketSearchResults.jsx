import React from "react";

function TicketSearchResults({ results, total, ticketList: TicketList }) {
    return (
        <TicketList
            title="Результаты поиска"
            tickets={results}
            total={total}
            getLink={({ id, portalId }) => `/ticket-show/portal/${portalId}/ticket/${id}`}

        />

    );
}


export default TicketSearchResults;
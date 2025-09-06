import { Routes, Route } from "react-router-dom";
import TicketView from "../components/tiket/TicketView";
import PortalTickets from "../components/tiket/PortalTickets";
import NoAnswerTickets from "../components/tiket/NoAnswerTickets";
import TicketMessageForm from "../components/message/TicketMessageForm";
import MessagesList from "../components/message/MessagesList";

function TicketRoutes() {
  return (
    <Routes>
          <Route path="/:portalId/ticket/:ticketId" element={<TicketView />} />
          <Route path="/:portalId/tickets" element={<PortalTickets />} />
          <Route path="/:portalId/no-answer" element={<NoAnswerTickets />} />
          <Route path="/:portalId/ticket/:ticketId/message-create" element={<TicketMessageForm />} />
          <Route path="/:portalId/ticket/:ticketId/messages-all" element={<MessagesList />} />
    </Routes>
  );
}

export default TicketRoutes;

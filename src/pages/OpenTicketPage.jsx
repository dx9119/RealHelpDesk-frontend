import React from "react";
import { useParams } from 'react-router-dom';
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import TicketView from "../../src/components/tiket/TicketView";
import MessagesList from "../components/message/MessagesList";
import TicketMessageForm from "../components/message/TicketMessageForm";
import TicketDelete from "../components/tiket/TicketDelete";

function OpenTicketPage() {
const { portalId, ticketId } = useParams();

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 d-flex justify-content-center bg-light">
        <div className="container text-start">
          <TicketView portalId={portalId} ticketId={ticketId} />
          <TicketDelete portalId={portalId} ticketId={ticketId} />
          <MessagesList portalId={portalId} ticketId={ticketId} />
          <TicketMessageForm portalId={portalId} ticketId={ticketId} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default OpenTicketPage;

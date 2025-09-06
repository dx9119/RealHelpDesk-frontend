import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import TicketList from "../components/tiket/TicketList";
import SearchTicketByPortals from "../components/tiket/SearchTicketByPortals";

function MyTicketPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
        <div className="container text-center">

            <SearchTicketByPortals />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default MyTicketPage;

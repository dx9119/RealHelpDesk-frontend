import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import CreateTicketForm from "../components/tiket/CreateTicketForm";
import PortalInfo from "../components/portal/PortalInfo";

function CreateTicketPage() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const portalId = searchParams.get("portalId");

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 bg-light py-4">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            {/* Информация о портале */}
                            <PortalInfo portalId={portalId} />

                            {/* Разделитель */}
                            <hr className="my-4" />

                            {/* Форма создания заявки */}
                            <CreateTicketForm portalId={portalId} />
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default CreateTicketPage;

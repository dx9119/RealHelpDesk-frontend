import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import TicketList from "../components/tiket/TicketList";

function TicketsPage() {
    const [searchParams] = useSearchParams();
    const portalId = searchParams.get("id");
    const [activeSection, setActiveSection] = useState(null);

    const sections = [
        {
            key: "OPEN",
            title: `Заявки без ответа`,
        },
        {
            key: "IN_PROGRESS",
            title: `Заявки в процессе решения`,
        },
        {
            key: "CLOSED",
            title: `Закрытые заявки`,
        },
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 bg-light py-5">
                <div className="container">
                    <h2 className="mb-4 text-center">Просмотр заявок по порталу №{portalId}</h2>
                    <div className="accordion" id="ticketAccordion">
                        {sections.map(({ key, title }, index) => (
                            <div className="accordion-item" key={key}>
                                <h2 className="accordion-header" id={`heading-${key}`}>
                                    <button
                                        className={`accordion-button ${activeSection === key ? "" : "collapsed"}`}
                                        type="button"
                                        data-bs-toggle="collapse"
                                        data-bs-target={`#collapse-${key}`}
                                        aria-expanded={activeSection === key}
                                        aria-controls={`collapse-${key}`}
                                        onClick={() =>
                                            setActiveSection(activeSection === key ? null : key)
                                        }
                                    >
                                        {title}
                                    </button>
                                </h2>
                                <div
                                    id={`collapse-${key}`}
                                    className={`accordion-collapse collapse ${activeSection === key ? "show" : ""}`}
                                    aria-labelledby={`heading-${key}`}
                                    data-bs-parent="#ticketAccordion"
                                >
                                    <div className="accordion-body">
                                        {activeSection === key && (
                                            <TicketList
                                                title={title}
                                                endpoint={`/api/v1/portals/${portalId}/ticket/page/status/${key}`}
                                                getLink={({ id }) =>
                                                    `/ticket-show/portal/${portalId}/ticket/${id}`
                                                }
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default TicketsPage;

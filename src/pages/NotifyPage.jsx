import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import EmailNotificationSettings from "../components/email/EmailNotificationSettings";


function NotifyPage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
                <div className="container text-center">
                <EmailNotificationSettings></EmailNotificationSettings>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default NotifyPage;

import React from "react";
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import UserAccount from "../components/user/UserAccount";


function ProfilePage() {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light">
                <div className="container text-center">
                <UserAccount></UserAccount>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default ProfilePage;

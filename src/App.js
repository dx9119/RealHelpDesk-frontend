import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./pages/HomePage";
import PortalPage from "./pages/PortalPage";
import PortalSettingPage from "./pages/PortalSettingsPage";
import TicketsPage from "./pages/TicketsPage";
import OpenTicketPage from "./pages/OpenTicketPage"
import MyTicketPage from "./pages/MyTicketPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import NotifyPage from "./pages/NotifyPage";
import CreateTicketPage from "./pages/CreateTicketPage";
import ErrorPage from "./pages/errors/ErrorPage";
import Page403 from "./pages/errors/Page403";
import Page500 from "./pages/errors/Page500";
import Page418 from "./pages/errors/Page418";
import PasswordResetPage from "./pages/PasswordResetPage";



function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <Routes>
          <Route path="/" element={< HomePage/>} />
          <Route path="/portal-manager" element={< PortalPage/>} />
          <Route path="/portal-settings" element={< PortalSettingPage/>} />

          <Route path="/tickets-manager" element={< TicketsPage/>} />
          <Route path="/tickets-my" element={< MyTicketPage/>} />
          <Route path="/ticket-show/portal/:portalId/ticket/:ticketId" element={<OpenTicketPage />} />
          <Route path="/ticket/create" element={< CreateTicketPage/>} />

          <Route path="/login" element={< LoginPage/>} />
          <Route path="/pass-reset" element={< PasswordResetPage/>} />
          <Route path="/register" element={< RegisterPage/>} />

          <Route path="/profile" element={< ProfilePage/>} />

          <Route path="/notify-settings" element={< NotifyPage/>} />

          <Route path="/some-error" element={< ErrorPage/>} />
          <Route path="/403page" element={< Page403/>} />
          <Route path="/418page" element={< Page418/>} />
          <Route path="/500page" element={< Page500/>} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

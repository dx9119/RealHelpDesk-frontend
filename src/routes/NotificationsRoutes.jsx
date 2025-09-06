import { Routes, Route } from "react-router-dom";
import EmailNotificationInfo from "../components/email/EmailNotificationInfo";
import EmailNotificationPolicy from "../components/email/EmailNotificationPolicy";
import EmailVerificationForm from "../components/email/EmailVerificationForm";

function NotificationsRoutes() {
  return (
    <Routes>
      <Route path="verify-email" element={<EmailVerificationForm />} />
      <Route path="settings" element={<EmailNotificationPolicy />} />
      <Route path="info" element={<EmailNotificationInfo />} />
    </Routes>
  );
}

export default NotificationsRoutes;

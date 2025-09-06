import { Routes, Route } from "react-router-dom";
import CreatePortal from "../components/portal/CreatePortal";
import DeletePortals from "../components/portal/DeletePortals";
import UserPortals from "../components/portal/UserPortals";
import PortalSettings from "../components/portal/PortalSettings";
import SetPortalStatus from "../components/portal/SetPortalStatus";
import AddPortalUsers from "../components/portal/AddPortalUsers";
import CreateTicketForm from "../components/tiket/CreateTicketForm";
import SharedPortals from "../components/portal/SharedPortals";

function PortalRoutes() {
  return (
    <Routes>
      <Route path="create" element={<CreatePortal />} />
      <Route path="delete" element={<DeletePortals />} />
      <Route path="my" element={<UserPortals />} />
      <Route path=":portalId/settings" element={<PortalSettings />} />
      <Route path=":portalId/status" element={<SetPortalStatus />} />
      <Route path=":portalId/users/add" element={<AddPortalUsers />} />
      <Route path=":portalId/create-ticket" element={<CreateTicketForm />} />
      <Route path="shared" element={<SharedPortals />} />
    </Routes>
  );
}

export default PortalRoutes;

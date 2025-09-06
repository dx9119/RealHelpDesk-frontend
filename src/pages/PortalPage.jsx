import { useState } from 'react';
import Header from "../pages/Header";
import Footer from "../pages/Footer";
import UserPortals from "../components/portal/UserPortals";
import DeletePortals from "../components/portal/DeletePortals";
import CreatePortal from "../components/portal/CreatePortal";
import { useNavigate } from 'react-router-dom';

function PortalPage() {
  const [pendingDeleteIds, setPendingDeleteIds] = useState([]);
  const navigate = useNavigate();

  const handleViewRequests = (id) => {
    console.log("🔍 Заявки портала:", id);
    navigate(`/tickets-manager?id=${id}`);
  };

  const handleEditPortal = (id) => {
    console.log("⚙️ Настройки портала:", id);
    navigate(`/portal-settings?id=${id}`);
  };

  const handleDeletePortal = (id) => {
    console.log("🗑️ Добавлен к удалению:", id);
    setPendingDeleteIds(prevIds =>
      prevIds.includes(id) ? prevIds : [...prevIds, id]
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 d-flex align-items-start justify-content-center bg-light pt-4">
        <div className="container">

          {/* Блок создания нового портала */}
          <div className="mb-4">
            <CreatePortal />
          </div>

          {/* 🗑️ Удаление выбранных */}
          {pendingDeleteIds.length > 0 && (
            <div className="mt-4">
              <h5>🧹 Выбранные для удаления:</h5>
              <DeletePortals initialIds={pendingDeleteIds} />
            </div>
          )}

          {/* 📋 Список доступных порталов */}
          <UserPortals
            onViewRequests={handleViewRequests}
            onDeletePortal={handleDeletePortal}
            onEditPortal={handleEditPortal}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default PortalPage;

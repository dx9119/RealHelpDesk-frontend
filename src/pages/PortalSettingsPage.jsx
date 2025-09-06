import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import ManagePortalUsers from "../components/portal/ManagePortalUsers";
import PortalEditor from "../components/portal/PortalEditor";
import { useSearchParams } from "react-router-dom";

function PortalSettingPage() {
  const [searchParams] = useSearchParams();
  const portalId = searchParams.get("id");

  if (!portalId) {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
          <Header />
          <main className="flex-grow-1 container py-5">
            <h2 className="mb-4 text-center text-danger">Не указан параметр id</h2>
          </main>
          <Footer />
        </div>
    );
  }

  return (
      <div className="d-flex flex-column min-vh-100 bg-light">
        <Header />

        <main className="flex-grow-1 container py-5">
          <h2 className="mb-4 text-center text-primary">
            ⚙️ Управление порталом #{portalId}
          </h2>

          <div className="row g-4">
            {/* Левая колонка: пользователи */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-info text-white">
                  <strong>Пользователи портала</strong>
                </div>
                <div className="card-body">
                  {/* key гарантирует корректный ремоунт при смене id */}
                  <ManagePortalUsers key={portalId} portalId={portalId} />
                </div>
              </div>
            </div>

            {/* Правая колонка: редактирование информации */}
            <div className="col-12 col-lg-6">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-success text-white">
                  <strong>Редактирование информации</strong>
                </div>
                <div className="card-body">
                  <PortalEditor portalId={portalId} />
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
  );
}

export default PortalSettingPage;

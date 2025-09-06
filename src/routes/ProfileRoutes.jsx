import { Routes, Route } from "react-router-dom";
import UserProfile from "../components/user/UserProfile";
import UserProfileForm from "../components/user/UserProfileForm";

function ProfileRoutes() {
  return (
    <Routes>
      <Route path="info" element={<UserProfile />} />
      <Route path="edit" element={<UserProfileForm />} />
    </Routes>
  );
}

export default ProfileRoutes;

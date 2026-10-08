import { Navigate, Route, Routes } from "react-router-dom";

import Authentication from "./pages/Authentication";
import MainPage from "./pages/MainPage";
import Dashboard from "./pages/sub-pages/Dashboard";
import MyLinks from "./pages/sub-pages/MyLinks";
import GroupLinks from "./pages/sub-pages/GroupLinks";
import Analytics from "./pages/sub-pages/Analytics";
import ProfilePage from "./pages/sub-pages/ProfilePage";
import LandingPage from "./pages/LandingPage";
import Toast from "./components/Toast";
import { useAuth } from "./context/useAuth";


function App() {
    const { token } = useAuth();

    return (
       <> 
        <Routes>

            <Route path="/Home" element={<LandingPage />} />
            <Route path="/detail" element={<LandingPage />} />
            <Route
                path="/"
                element={<Navigate to="/Home" replace />}
            />

            {/* Authentication */}
            <Route path="/login" element={<Authentication />} />
            <Route path="/register" element={<Authentication />} />

            {/* Main application layout */}
            <Route element={<MainPage />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/mylinks" element={<MyLinks />} />

                <Route path="/grouplinks" element={<GroupLinks />} />

                <Route path="/analytics" element={<Analytics />} />

                <Route path="/profile" element={<ProfilePage />} />

            </Route>

            {/* Unknown URL */}
            <Route
                path="*"
                element={
                    <Navigate
                        to={token ? "/dashboard" : "/detail"}
                        replace
                    />
                }
            />

        </Routes>
        <Toast/>
      </> 
    );
}

export default App;
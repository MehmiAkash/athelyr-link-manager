import { Navigate, Route, Routes } from "react-router-dom";

import Authentication from "./pages/Authentication";
import MainPage from "./pages/MainPage";

import Dashboard from "./pages/sub-pages/Dashboard";
import MyLinks from "./pages/sub-pages/MyLinks";
import Favorites from "./pages/sub-pages/Favorites";
import Toast from "./components/Toast";



function GroupLinks() {
    return <h1 className="text-white text-3xl">Group Links</h1>;
}

function Analytics() {
    return <h1 className="text-white text-3xl">Analytics</h1>;
}

function App() {
    return (
       <> 
        <Routes>

            {/* Authentication */}
            <Route path="/login" element={<Authentication />} />
            <Route path="/register" element={<Authentication />} />

            {/* Main application layout */}
            <Route element={<MainPage />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/favorites" element={<Favorites/>} />

                <Route path="/mylinks" element={<MyLinks />} />

                <Route path="/grouplinks" element={<GroupLinks />} />

                <Route path="/analytics" element={<Analytics />} />

            </Route>

            {/* Unknown URL */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
        <Toast/>
      </> 
    );
}

export default App;
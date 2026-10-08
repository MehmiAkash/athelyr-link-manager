import TopNav from "../components/TopNav";
import Sidebar from "../components/Sidebar";

import { Navigate, Outlet } from "react-router-dom";
import ColorPicker from "../components/ColorPicker";
import { useAuth } from "../context/useAuth";
import Profile from "../components/Profile";

function MainPage() {
    const { token, user } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-zinc-950">

            <div className="hidden h-screen shrink-0 lg:sticky lg:top-0 lg:block">
                <Sidebar />
            </div>

            <div className="flex-1 min-w-0">

                <TopNav />

                <div className="relative">
                    <div className="absolute top-2 right-4 z-50 flex items-center gap-1.5">
                        <ColorPicker />
                        <Profile user={user} />
                    </div>

                    <Outlet />
                </div>

            </div>
        </div>
    );
}

export default MainPage;
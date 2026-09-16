import TopNav from "../components/TopNav"
import Sidebar from "../components/Sidebar"

import { Outlet } from "react-router-dom"
import ColorPicker from "../components/ColorPicker"
import { useAuth } from "../context/useAuth";
import Profile from "../components/Profile";

function MainPage() {
  const { user } = useAuth();
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1">
        <TopNav/>
        <div className="absolute top-3 right-4 z-50 flex items-center gap-1.5">
          <ColorPicker />
          <Profile user={user} />
        </div>
        <Outlet/>
      </div>
        
    </div>
  )
}

export default MainPage

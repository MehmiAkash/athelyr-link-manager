import BottomNav from "../components/TopNav"
import Sidebar from "../components/Sidebar"
import CreateLink from "../components/CreateLink"

function MainPage() {
  return (
    <div className="flex min-h-screen bg-zinc-950">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <BottomNav />
      <CreateLink/>
    </div>
  )
}

export default MainPage

import bgsvg from "../assets/URL.svg"
import Card from '../components/Card'
import Footer from "../components/Footer"
import Logo from "../components/Logo"

function Authentication() {
  return (
       <div className="relative min-h-screen bg-zinc-900 ">
        
      <div className="absolute top left-1/2 -translate-x-1/2 text-center select-none z-20 pt-2 ">
       <Logo/>
       
      </div>  
      <img
        src={bgsvg}
        alt="background"
        className="absolute inset-0 w-full h-full object-cover opacity-5 select-none"
      />
      <div className="relative z-10 min-h-screen flex justify-center items-center">
  <Card />

  <div className="hidden xl:block absolute bottom-6">
    <Footer />
  </div>
      </div>
      <div className="block xl:hidden">
        <Footer />
      </div>
  
    </div>
  )
}

export default Authentication

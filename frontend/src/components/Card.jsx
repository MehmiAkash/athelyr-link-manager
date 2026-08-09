import { useState } from "react";
import Login from "./Login"
import Register from "./Register"


function Card() {
  const [isLogin , setIsLogin] = useState(false);
  return (
     <div className=" bg-zinc-700/10 backdrop-blur-sm py-3 px-10  md:py-6 rounded-xl">
     {isLogin ? (
        <Login onSwitch={() => setIsLogin(false)} />
      ) : (
        <Register onSwitch={() => setIsLogin(true)} />
      )}
    </div>
  )
}

export default Card

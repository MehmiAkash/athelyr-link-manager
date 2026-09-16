import { useState } from "react"
import { loginUser } from "../services/authService";
import { useAuth } from "../context/useAuth";
import { showToast } from "../services/toastService";
import { useNavigate } from "react-router-dom";



function Login({ setLoading ,onSwitch}) {  
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
       email:email,
       password:password
    }
    setLoading(true);
    try{
      const data = await loginUser(loginData);
      console.log(data);
      login(data);
      navigate("/dashboard");
      showToast("success","logged in sucessfully");
    }catch (error){
      showToast("error",error.message);
    }finally{
      setLoading(false);
    }
  };

  return (

  
   <div className='flex flex-col items-center'>
       
       <h1 className= ' text-(--accent-300) text-3xl md:text-5xl'>Login</h1>         


      <form onSubmit={handleSubmit} className="space-y-4 pt-5">
        <div  className="flex flex-col md:flex-row md:items-center items-start gap-2 md:gap-6 p-2">
           <label className="w-32 text-white text-2xl">
            EMAIL
          </label>
          <input type="email" placeholder='Enter Email' value={email} onChange={(e)=>setEmail(e.target.value)} className='md:w-auto w-full text-2xl md:px-4 px-2 text-white border border-white  rounded-lg'/>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 p-2">
           <label className="w-32 text-white text-2xl">
            PASSWORD
          </label>
           <input type="password" placeholder='Enter Password' value={password} onChange={(e)=>setPassword(e.target.value)} className='w-full md:w-auto text-2xl px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        
           
        <div className="flex justify-center md:justify-end text-white py-4 px-2">
          <button type="submit" className="w-full md:w-auto text-2xl text-white border border-white rounded-lg md:px-6 shadow-md   hover:text-(--accent-400) hover:bg-zinc-900 transition duration-200" >PROCEED ➜</button>
        </div>
        <div className="flex justify-center"> 
          <button
            type="button"
            onClick={onSwitch}
            className="text-xl text-(--accent-100) hover:text-(--accent-400) transition-colors duration-200">
              Don't have an account? Register
          </button>
        </div>
      </form>    
    </div>
  )
}

export default Login

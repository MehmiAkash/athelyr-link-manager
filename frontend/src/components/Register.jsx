import { useState } from "react"
import { registerUser } from "../services/authService";
import { useAuth } from "../context/useAuth";

function Register({ setLoading , onSwitch}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   const { register } = useAuth();
  const handleSubmit = async(e) => {
      e.preventDefault();
      const registerData = {
        name:name,
        email:email,
        password:password,
        confirmPassword:confirmPassword
      }
      setLoading(true);
          try{
            const data = await registerUser(registerData);
            console.log(data);
            register(data);
          }catch (error){
            console.error(error);
          }finally{
            setLoading(false);
          }
    }  
  return (
     <div className='flex flex-col items-center'>
       
       <h1 className='text-(--accent-300) text-3xl md:text-5xl'>Register</h1>         

    <form onSubmit={handleSubmit}  className="space-y-4 pt-5">
        <div  className="flex flex-col md:flex-row  items-start md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            NAME
          </label>
          <input type="text" placeholder='Enter Name' value={name} onChange={e=>setName(e.target.value)} className='text-xl md:text-2xl w-full md:w-auto px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        <div  className="flex flex-col md:flex-row items-start  md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            EMAIL
          </label>
          <input type="email" placeholder='Enter Emai' value={email} onChange={e=>setEmail(e.target.value)} className='text-xl md:text-2xl w-full md:w-auto px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            PASSWORD
          </label>
           <input type="password" placeholder='Enter Password' value={password} onChange={e=>setPassword(e.target.value)} className='text-xl md:text-2xl w-full md:w-auto px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            CONFIRM PASSWORD
          </label>
           <input type="password" placeholder='Enter Password'  value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className='text-xl md:text-2xl px-2 md:px-4 w-full md:w-auto text-white border border-white  rounded-lg'/>
        </div>
         <div className="flex justify-center md:justify-end text-white py-2 md:py-4 px-2">
          <button type="submit" className="w-full md:w-auto text-xl md:text-2xl text-white border border-white rounded-lg md:px-6 shadow-md   hover:text-(--accent-400) hover:bg-zinc-900 transition duration-200" >PROCEED ➜</button>
        </div> 
        <div className="flex justify-center"> 
          <button
            type="button"
            onClick={onSwitch}
            className="text-md md:text-xl text-(--accent-100) hover:text-(--accent-400) transition-colors duration-200">
              Already have an account? Sign in
            </button>
        </div>
      </form>    

    </div>
  )
}

export default Register

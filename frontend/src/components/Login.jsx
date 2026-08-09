function Login({onSwitch}) {
  return (
   <div className='flex flex-col items-center'>
       
       <h1 className= ' text-rose-300 text-3xl md:text-5xl'>Login</h1>         


    <div className="space-y-4 pt-5">
        <div  className="flex flex-col md:flex-row md:items-center items-start gap-2 md:gap-6 p-2">
           <label className="w-32 text-white text-2xl">
            EMAIL
          </label>
          <input type="email" placeholder='Enter Email' className='md:w-auto w-full text-2xl md:px-4 px-2 text-white border border-white  rounded-lg'/>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 p-2">
           <label className="w-32 text-white text-2xl">
            PASSWORD
          </label>
           <input type="password" placeholder='Enter Password' className='w-full md:w-auto text-2xl px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        
           
        <div className="flex justify-center md:justify-end text-white py-4 px-2">
          <button className="w-full md:w-auto text-2xl text-white border border-white rounded-lg md:px-6 shadow-md   hover:text-rose-300 hover:bg-zinc-900 transition duration-200" >PROCEED ➜</button>
        </div>
        <div className="flex justify-center"> 
          <button
            onClick={onSwitch}
            className="text-xl text-rose-100 hover:text-rose-300 transition-colors duration-200">
              Don't have an account? Register
          </button>
        </div>
      </div>    
    </div>
  )
}

export default Login

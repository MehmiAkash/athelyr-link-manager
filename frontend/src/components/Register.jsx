function Register({onSwitch}) {
  return (
     <div className='flex flex-col items-center'>
       
       <h1 className='text-rose-300 text-3xl md:text-5xl'>Register</h1>         


    <div className="space-y-4 pt-5">
        <div  className="flex flex-col md:flex-row  items-start md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            NAME
          </label>
          <input type="text" placeholder='Enter Name' className='text-xl md:text-2xl w-full md:w-auto px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        <div  className="flex flex-col md:flex-row items-start  md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            EMAIL
          </label>
          <input type="email" placeholder='Enter Email' className='text-xl md:text-2xl w-full md:w-auto px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            PASSWORD
          </label>
           <input type="password" placeholder='Enter Password' className='text-xl md:text-2xl w-full md:w-auto px-2 md:px-4 text-white border border-white  rounded-lg'/>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6 px-2 md:p-2">
           <label className="w-62 text-white text-xl md:text-2xl">
            CONFIRM PASSWORD
          </label>
           <input type="password" placeholder='Enter Password' className='text-xl md:text-2xl px-2 md:px-4 w-full md:w-auto text-white border border-white  rounded-lg'/>
        </div>
         <div className="flex justify-center md:justify-end text-white py-2 md:py-4 px-2">
          <button className="w-full md:w-auto text-xl md:text-2xl text-white border border-white rounded-lg md:px-6 shadow-md   hover:text-rose-300 hover:bg-zinc-900 transition duration-200" >PROCEED ➜</button>
        </div> 
        <div className="flex justify-center"> 
          <button
            onClick={onSwitch}
            className="text-md md:text-xl text-rose-100 hover:text-rose-300 transition-colors duration-200">
              Already have an account? Sign in
            </button>
        </div>
      </div>    
    </div>
  )
}

export default Register

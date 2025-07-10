import React from 'react'

const Navbar = () => {
  return (
    <nav className=' bg-slate-800 text-white '>
      <div className="mycontainer flex justify-between items-center px-4 py-7 h-14">

        <div className="logo font- bold text-white text-2xl">
          <span className='text-green-700'>  &lt;</span>
          Pass
          <span className='text-green-700 font-bold text-center '>OP/ &gt; </span>

        </div>
       
      </div>
    </nav>
  )
}

export default Navbar

// eslint-disable-next-line no-unused-vars
import React from 'react'

const Navbar = () => {
  return (
    <nav  className='flex justify-between  text-white py-1'>
        <div className='logo flex '>
            <img className='mx-3 w-10 invert' src="https://api.domatron.com/storage/icons/ffffff/oi.svg" alt="" />
            <span className='font-bold text-xl text-black '>Ever Earlier</span>
        </div>
        {/* <ul className='flex gap-8 mx-9'>
            <li className='cursor-pointer hover:font-bold'>Home</li>
            <li className='cursor-pointer hover:font-bold'>Your task</li>
        </ul> */}

    </nav>
  )
}

export default Navbar

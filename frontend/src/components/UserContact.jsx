import React from 'react'
import assets from '../assets/assets'

export default function UserContact({user} , ) {
  return (
    <div className='flex justify-between items-center  backdrop-blur-3xl cursor-pointer'>
        <div className='flex items-center gap-1'>
            <img src={user.profilePic} alt="" className='w-[15%] rounded-full'/>
            <div className='flex flex-col gap-1'>
                <span>{user.fullName}</span>
                <span>online</span>
            </div>
        </div>
        <div className='flex justify-center items-center rounded-full bg-gray-700 w-[40px] h-[25px]'>4</div>
    </div>
  )
}

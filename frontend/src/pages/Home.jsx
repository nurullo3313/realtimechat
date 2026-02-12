import React, { useState } from 'react'
import Contacts from '../components/Contacts'
import Chat from '../components/Chat'
import Profile from '../components/Profile'

export default function Home() {
    const [selectedUser, setSelectedUser] = useState(false)


  return (
    <div className='w-[60%] h-[80vh] border-white border-2 rounded-3xl  backdrop-blur-xl
    flex overflow-hidden
    '>
       <Contacts selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        {
            selectedUser &&<Profile selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
        }
        
    </div>
  )
}

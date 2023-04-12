import React from 'react'
import { CurrentUser } from '../../context/CurrentUserContext';

export default function LogoutBar() {
  function logoutFromGoogle() {
    window.open('http://localhost:5000/auth/logout', '_self');
  }

  const user = CurrentUser();
  console.log(user);
  return (
    <section className='flex justify-between font-semibold mx-7'>
        <div className='flex my-6'>
            <img src={user.photoURL} alt="" className='w-12 rounded-full' />
            <p className='mx-4 my-2 text-lg'>{user.firstName + " " + user.familyName}</p>
        </div>
        <div className='my-5'>
            <button onClick={logoutFromGoogle} className='my-3 px-3 py-1 rounded bg-violet-400 text-white text-sm'>Logout</button>
        </div>
    </section>
  )
}

import React from 'react'
import { useSelector } from 'react-redux';

export default function LogoutBar() {
  function logoutFromGoogle() {
    const logoutRequestURI = 'http://localhost:5000/auth/logout';
    window.open(logoutRequestURI, '_self');
  }

  const user = useSelector(state => state.auth.value.user);
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

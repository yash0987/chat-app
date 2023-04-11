import React from 'react'
import googleIcon from './../Img/google-icon.png';

export default function LoginPage() {
  function loginWithGoogle() {
    window.open('http://localhost:5000/auth/google', '_self');
  }

  return (
    <div onClick={loginWithGoogle} className='flex justify-center my-[22.5%]'>
        <button className='flex px-4 py-2 border-[1px] border-black active:shadow-md'>
          <img src={googleIcon} alt="" className='mr-3 w-6' />
          <p>Continue with Google</p>
        </button>
    </div>
  )
}

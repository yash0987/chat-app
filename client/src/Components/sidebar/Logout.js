import React from 'react';
import logout from '../../img/logout.png';
import { useSelector } from 'react-redux';


export default function Logout() {
  const theme = useSelector(state => state.theme.value);
  
  function logoutFromGoogle() {
    const logoutRequestURI = 'http://localhost:5000/auth/logout';
    window.open(logoutRequestURI, '_self');
  }
  
  return (
    <li onClick={() => logoutFromGoogle()} className={`flex p-2 ml-3 rounded-l-full ${theme.hoverBg100}`}>
      <img src={logout} alt="" className='mx-2 w-8' />
      <span className='m-1'>Log out</span>
    </li>
  )
}

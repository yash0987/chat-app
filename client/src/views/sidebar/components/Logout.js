import React from 'react';
import { useSelector } from 'react-redux';

export default function Logout() {
  const theme = useSelector(state => state.theme.value);
  
  function logoutFromGoogle() {
    const logoutRequestURI = 'http://localhost:5000/auth/logout';
    window.open(logoutRequestURI, '_self');
  }
  
  return (
    <li onClick={() => logoutFromGoogle()} className={`px-2 py-1 rounded ${theme.hoverBg200}`}>Log out</li>
  )
}

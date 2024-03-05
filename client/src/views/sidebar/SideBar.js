import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Logout from 'views/sidebar/components/Logout';
import profile from 'assets/profile.png';
import star from 'assets/star.png';
import themes from 'assets/theme.png';

export default function SideBar(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);

  return (
    props.settingToggle ? 
    <div onClick={() => props.setSettingToggle(false)} className='absolute w-screen h-screen top-0 z-20 flex justify-end bg-black bg-opacity-20 text-gray-500 overflow-hidden'>
      <ul className='w-1/5 bg-white'>
        <li className='flex justify-between m-2'>
          <span className={`mx-4 my-1 ${theme.text600}`}>{ user.firstName + " " + user.familyName }</span>
          <img src={user.photoURL} alt="" className='mx-2 w-8 rounded-full' /> 
        </li>

        <hr className='my-3' />

        <li className={`flex p-2 ml-3 rounded-l-full ${theme.hoverBg100}`}>
          <img src={profile} alt="" className='mx-2 w-8' />
          <span className='m-1'>Profile</span>
        </li>
        <li className={`flex p-2 ml-3 rounded-l-full ${theme.hoverBg100}`}>
          <img src={star} alt="" className='mx-2 w-8' />
          <span className='m-1'>Starred Messages</span>
        </li>

        <hr className='my-3' />

        <Link to={'/themes'} className={`flex p-2 ml-3 rounded-l-full ${theme.hoverBg100}`}>
          <img src={themes} alt="" className='mx-2 w-8' />
          <span className='m-1'>Themes & Wallpapers</span>
        </Link>

        <hr className='my-3' />

        <Logout />
      </ul>
    </div>
    : null
  )
}

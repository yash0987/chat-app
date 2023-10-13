import React from 'react';
import { useSelector } from 'react-redux';
import profile from '../../img/profile.png';
import star from '../../img/star.png';
import themes from '../../img/theme.png';
import wallpaper from '../../img/wallpaper.png';
import Logout from './Logout';


export default function SideBar(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);

  return (
    props.settingToggle ? 
    <div onClick={() => props.setSettingToggle(false)} className='absolute w-screen h-screen top-0 flex justify-end bg-black bg-opacity-20 text-gray-500 overflow-hidden'>
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

        <li onClick={() => props.setToggle('showThemes')} className={`flex p-2 ml-3 rounded-l-full ${theme.hoverBg100}`}>
          <img src={themes} alt="" className='mx-2 w-8' />
          <span className='m-1'>Themes</span>
        </li>
        <li onClick={() => props.setToggle('showWallpapers')} className={`flex p-2 ml-3 rounded-l-full ${theme.hoverBg100}`}>
          <img src={wallpaper} alt="" className='mx-2 w-8' />
          <span className='m-1'>Wallpapers</span>
        </li>

        <hr className='my-3' />

        <Logout />
      </ul>
    </div>
    : null
  )
}

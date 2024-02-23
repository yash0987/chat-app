import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import personIcon from '../../assets/personw.png';
import groupIcon from '../../assets/groupw.png';
import inboxIcon from '../../assets/inbox.png';

export default function PinBar() {
  const theme = useSelector(state => state.theme.value);
  const [block, setBlock] = useState(1);
  
  const style = {
    activeBtn: `${theme.bg500} ${theme.hoverBg600} w-12 rounded-2xl peer`,
    inactiveBtn: `${theme.bg400} ${theme.hoverBg500} w-12 rounded-[25px] hover:rounded-2xl peer`
  }

  return (
    <div className='grid grid-flow-row grid-rows-10 my-2 ml-2 h-[90vh]'>
      <div className='flex items-center justify-between *:transition-all *:duration-200'>
        <NavLink to={'/chats/@me'} onClick={() => setBlock(1)} className={({isActive}) => isActive ? style.activeBtn : style.inactiveBtn}><img src={personIcon} alt=""  /></NavLink>
        <div className={`${block === 1? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} ml-2 w-[5px] rounded-l-md peer-hover:h-[1rem]`}></div>
      </div>
      <div className='flex items-center justify-between *:transition-all *:duration-200'>
        <NavLink to={'/groups'} onClick={() => setBlock(2)} className={({isActive}) => isActive ? style.activeBtn : style.inactiveBtn}><img src={groupIcon} alt="" /></NavLink>
        <div className={`${block === 2? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} ml-2 w-[5px] rounded-l-md peer-hover:h-[1rem]`}></div>
      </div>
      <div className='flex items-center justify-between *:transition-all *:duration-200'>
        <NavLink to={'/requests'} onClick={() => setBlock(3)} className={({isActive}) => isActive ? style.activeBtn : style.inactiveBtn}><img src={inboxIcon} alt="" /></NavLink>
        <div className={`${block === 3? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} ml-2 w-[5px] rounded-l-md peer-hover:h-[1rem]`}></div>
      </div>
    </div>
  )
}

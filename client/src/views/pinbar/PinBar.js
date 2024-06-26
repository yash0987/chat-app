import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Tooltip from 'components/Tooltip';
import personIcon from 'assets/personw.png';
import groupIcon from 'assets/groupw.png';

export default function PinBar() {
  const theme = useSelector(state => state.theme.value);
  const [block, setBlock] = useState(1);
  
  const style = {
    activeBtn: `${theme.bg500} ${theme.hoverBg600} w-12 rounded-2xl`,
    inactiveBtn: `${theme.bg400} ${theme.hoverBg500} w-12 rounded-[25px] hover:rounded-2xl`
  }

  return (
    <div className={`pr-3 ${theme.bg200}`}>
      <div className='flex items-center justify-between relative group *:transition-all *:duration-200 my-2'>
        <div className={`${block === 1? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} mr-2 w-[5px] rounded-r-md group-hover:h-[1rem]`}></div>
        <NavLink to={'/chats/@me'} onClick={() => setBlock(1)} className={({isActive}) => isActive ? style.activeBtn : style.inactiveBtn}><img src={personIcon} alt=""  /></NavLink>
        <Tooltip text={'Friends'} position={'right'} />
      </div>
      <div className='flex items-center justify-between relative group *:transition-all *:duration-200 my-2'>
        <div className={`${block === 2? `h-[2rem] ${theme.bg600}`:`h-[7px] ${theme.bg500}`} mr-2 w-[5px] rounded-r-md group-hover:h-[1rem]`}></div>
        <NavLink to={'/groups'} onClick={() => setBlock(2)} className={({isActive}) => isActive ? style.activeBtn : style.inactiveBtn}><img src={groupIcon} alt="" /></NavLink>
        <Tooltip text={'Groups'} position={'right'} />
      </div>
    </div>
  )
}

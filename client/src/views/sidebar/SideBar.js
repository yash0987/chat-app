import React, { useState } from 'react';
import SectionList from './components/SectionList';
import Profile from './components/Profile';
import Appearance from './components/Appearance';
import { useSelector } from 'react-redux';

export default function SideBar(props) {
  const [section, setSection] = useState('Profile');
  const [profileEditStatus, setProfileEditStatus] = useState(false);
  const theme = useSelector(state => state.theme.value);

  let component = null;
  switch (section) {
    case "Profile":
      component = <Profile profileEditStatus={profileEditStatus} setProfileEditStatus={setProfileEditStatus} />
      break;
    case "Appearance":
      component = <Appearance />
      break;
  
    default:
      break;
  }

  return (
    props.settingToggle ? 
    <div className='absolute w-screen h-screen top-0 z-20 flex justify-center overflow-hidden'>
      <div className={`w-1/3 flex justify-end ${theme.bg100}`}><SectionList section={section} setSection={setSection} profileEditStatus={profileEditStatus} /></div>
      <div className={`w-2/3 flex justify-start ${theme.bg50}`}>
        <div className='w-3/4 px-8 py-14 relative'>
        <button disabled={profileEditStatus} onClick={() => props.setSettingToggle(false)} className={`absolute top-16 -right-5 px-2 py-[3px] rounded-full border border-black ${theme.hoverBg200}`}>&#10005;</button>
          { component }
        </div>
      </div>
    </div>
    : null
  )
}

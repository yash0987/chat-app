import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import searchLogo from '../img/search.png';
import settingLogo from '../img/setting.png';
import SearchSection from './search-section/SearchSection';

export default function Navbar(props) {
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const searchbar = useRef();

  window.onclick = (event) => {
    if (event.target.firstElementChild) {
      if (event.target.firstElementChild.ref !== searchbar) {
        console.log("Yes I am search ref");
        setShowSearchBar(false);
      }
    }
  }
  
  return (
    <>
      <div ref={searchbar} className={`grid grid-cols-12 p-2 border-b-[1px] ${theme.borderB700} ${theme.bg100}`}>
        <p className={`place-self-center text-2xl ${theme.text400}`}>ChatMe</p>
        <div className='flex col-start-12 col-end-12 place-self-center'>
          <img onClick={() => setShowSearchBar(true)} src={searchLogo} alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg200}`} />
          <img onClick={() => props.setSettingToggle(true)} src={settingLogo} alt="" className={`mx-1 w-8 rounded-full ${theme.hoverBg200}`} />
          <img src={user.photoURL} alt="" className='mx-1 w-8 rounded-full' />
        </div>
      </div>
      { showSearchBar ? <SearchSection /> : null }
    </>
  )
}

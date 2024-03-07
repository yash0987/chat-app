import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { showProfileToggle } from 'features/toggle-slice/toggleSlice';
import Searchbar from 'views/navbar/components/Searchbar';
import FriendRequests from 'views/friend-requests/FriendRequests';
import searchIcon from 'assets/searchBlack.png';
import settingIcon from 'assets/setting.png';
import profileIcon from 'assets/profile-image.png';
import inboxIcon from 'assets/inboxb.png';
import Tooltip from 'components/Tooltip';

export default function Navbar(props) {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showRequestSection, setShowRequestSection] = useState(false);
  const user = useSelector(state => state.auth.value.user);
  const theme = useSelector(state => state.theme.value);
  const showProfile = useSelector(state => state.toggle.value.showProfile);
  const dispatch = useDispatch();
  const searchbar = useRef();
  const params = useParams();
  
  useEffect(() => {
    console.log(Object.keys(params).length);
    console.log("this is params length")
    if (!Object.keys(params).length) dispatch(showProfileToggle(false));
    // eslint-disable-next-line
  }, [params])

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
      <div ref={searchbar} className={`grid grid-flow-col justify-between relative px-4 py-1 border-b-[1px] ${theme.borderB700} ${theme.bg200}`}>
        <p className={`px-4 text-2xl ${theme.text400}`}>ChatMe</p>
        <div className='grid grid-flow-col gap-2 place-items-center'>
          { Object.keys(params).length ?
          <div className='relative group'>
            <img onClick={() => dispatch(showProfileToggle(showProfile ^ 1))} src={profileIcon} alt="" className={`size-8 rounded-full ${theme.hoverBg300}`} />
            <Tooltip text={'Profile'} position={'bottom'} />
          </div>: null }
          <div className='relative group'>
            <img onClick={() => setShowSearchBar(true)} src={searchIcon} alt="" className={`size-8 rounded-full ${theme.hoverBg300}`} />
            <Tooltip text={'Search'} position={'bottom'} />
          </div>
          <div className='relative group'>
            <img onClick={() => setShowRequestSection(prevState => prevState ^ 1)} src={inboxIcon} alt="" className={`size-8 rounded-full ${theme.hoverBg300}`} />
            <Tooltip text={'Inbox'} position={'bottom'} />
          </div>
          <div className='relative group'>
            <img onClick={() => props.setSettingToggle(true)} src={settingIcon} alt="" className={`size-8 rounded-full ${theme.hoverBg300}`} />
            <Tooltip text={'Setting'} position={'bottom'} />
          </div>
          <img src={user.photoURL} alt="" className='size-8 rounded-full' />
        </div>
      { showRequestSection ? <FriendRequests /> : null }
      </div>
      { showSearchBar ? <Searchbar /> : null }
    </>
  )
}

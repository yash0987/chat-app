import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import FriendsSection from 'views/friends/FriendsSection';
import Profile from 'components/ChatProfile';

export default function ChatLayout() {
  const showProfile = useSelector(state => state.toggle.value.showProfile);

  return (
    <div className={`grid grid-flow-col ${showProfile ? 'grid-cols-[1.1fr_2.8fr_1.1fr]' : 'grid-cols-[1.1fr_3.9fr]'}`}>
      <FriendsSection />
      <Outlet />
      { showProfile ? <Profile /> : null }
    </div>
  )
}

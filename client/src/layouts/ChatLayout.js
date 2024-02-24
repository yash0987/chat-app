import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AllFriendsSection from 'views/friends/FriendsSection';

export default function ChatLayout() {
  const theme = useSelector(state => state.theme.value);

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet />
      <AllFriendsSection />
    </div>
  )
}

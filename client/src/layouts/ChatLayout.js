import React from 'react';
import { Outlet } from 'react-router-dom';
import FriendsSection from 'views/friends/FriendsSection';

export default function ChatLayout() {
  return (
    <div className={`grid grid-flow-col grid-cols-[1fr_3fr]`}>
      <FriendsSection />
      <Outlet />
    </div>
  )
}

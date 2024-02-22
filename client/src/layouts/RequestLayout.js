import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FriendRequests from '../views/friend-requests/FriendRequests';

export default function RequestLayout() {
  const theme = useSelector(state => state.theme.value);

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet />
      <FriendRequests />
    </div>
  )
}

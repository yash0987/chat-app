import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import FriendRequests from '../friend-section/friend-requests/FriendRequests';

export default function RequestLayout() {
  const theme = useSelector(state => state.theme.value);
  const { newChat, setNewChat, latestChat, setLatestChat } = useOutletContext();

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet context={{ newChat, setNewChat, latestChat, setLatestChat }} />
      <FriendRequests setLatestChat={setLatestChat} setNewChat={setNewChat} newChat={newChat} />
    </div>
  )
}

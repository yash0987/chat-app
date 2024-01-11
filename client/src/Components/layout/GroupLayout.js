import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GroupSection from '../friend-section/groups/GroupSection';

export default function GroupLayout() {
  const theme = useSelector(state => state.theme.value);
  const { newChat, setNewChat, latestChat, setLatestChat } = useOutletContext();

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet context={{ newChat, setNewChat, latestChat, setLatestChat }} />
      <GroupSection newChat={newChat} setNewChat={setNewChat} latestChat={latestChat} setLatestChat={setLatestChat} />
    </div>
  )
}

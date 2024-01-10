import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AllFriendsSection from '../friend-section/all-friends/AllFriendsSection';

export default function ChatLayout() {
  const theme = useSelector(state => state.theme.value);
  const { secondPerson, setSecondPerson, oldChatPerson, setOldChatPerson } = useOutletContext();

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet context={{ secondPerson, setSecondPerson, oldChatPerson, setOldChatPerson }} />
      <AllFriendsSection setOldChatPerson={setOldChatPerson} setSecondPerson={setSecondPerson} secondPerson={secondPerson} />
    </div>
  )
}

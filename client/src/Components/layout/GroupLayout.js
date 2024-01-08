import React from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GroupSection from '../friend-section/groups/GroupSection';

export default function GroupLayout() {
  const theme = useSelector(state => state.theme.value);
  const { toggle, setToggle, secondPerson, setSecondPerson, oldChatPerson, setOldChatPerson } = useOutletContext();

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet context={{ toggle, setToggle, secondPerson, setSecondPerson, oldChatPerson, setOldChatPerson }} />
      <GroupSection setOldChatPerson={setOldChatPerson} setSecondPerson={setSecondPerson} secondPerson={secondPerson} setToggle={setToggle} />
    </div>
  )
}

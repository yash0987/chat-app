import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import GroupSection from 'views/groups/GroupsSection';
import Profile from 'components/ChatProfile';

export default function GroupLayout() {
  const showProfile = useSelector(state => state.toggle.value.showProfile);

  return (
    <div className={`grid grid-flow-col ${showProfile ? 'grid-cols-[1fr_2fr_1fr]' : 'grid-cols-[1fr_3fr]'}`}>
      <GroupSection />
      <Outlet />
      { showProfile ? <Profile /> : null }
    </div>
  )
}

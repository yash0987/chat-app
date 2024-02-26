import React from 'react';
import { Outlet } from 'react-router-dom';
import GroupSection from 'views/groups/GroupsSection';

export default function GroupLayout() {
  return (
    <div className={`grid grid-flow-col grid-cols-[1fr_3fr]`}>
      <GroupSection />
      <Outlet />
    </div>
  )
}

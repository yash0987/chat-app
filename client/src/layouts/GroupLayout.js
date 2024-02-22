import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GroupSection from '../views/groups/GroupsSection';

export default function GroupLayout() {
  const theme = useSelector(state => state.theme.value);

  return (
    <div className={`grid grid-flow-col ${theme.bg100}`}>
      <Outlet />
      <GroupSection />
    </div>
  )
}
